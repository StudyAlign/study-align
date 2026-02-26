import aiofiles.os
from fastapi import Header, HTTPException, UploadFile, status
from tempfile import NamedTemporaryFile
import shutil
from typing import IO
from os import path



async def content_length_check(content_length: int = Header(..., lt=512_000)):
    return content_length

def upload_file(file: UploadFile, file_size: int, logo_path: str):
    real_file_size = 0
    temp: IO = NamedTemporaryFile(delete=False)
    for chunk in file.file:
        real_file_size += len(chunk)
        if real_file_size > file_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large"
            )
        temp.write(chunk)
    temp.close()
    shutil.move(temp.name, logo_path)


async def delete_file(logo_path: str):
    if path.exists(logo_path):
        try:
            await aiofiles.os.remove(logo_path)
        except Exception:
            print(Exception)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='Error deleting the file',
            )
        return
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='File not found',
    )