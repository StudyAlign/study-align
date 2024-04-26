from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from typing import Union
import uuid


# generic interactions do not extend CreateBase model to allow for optional condition_id
class InteractionCreateBase(BaseModel):
    condition_id: int


class MouseEventEnum(str, Enum):
    click = "click"
    dblclick = "dblclick"
    mouseup = "mouseup"
    mousedown = "mousedown"
    mouseenter = "mouseenter"
    mouseleave = "mouseleave"
    mouseout = "mouseout"
    mouseover = "mouseover"


class MouseInteractionBase(BaseModel):
    uuid: uuid.UUID
    event: MouseEventEnum
    time: datetime
    screenX: float
    screenY: float
    clientX: float
    clientY: float
    ctrlKey: bool
    shiftKey: bool
    altKey: bool
    metaKey: bool
    button: int
    button: int
    relatedTarget: Union[dict, list, set, float, int, str, bytes, bool]
    x: float  # alias for clientX
    y: float  # alias for clientY
    metaData: Union[dict, list, set, float, int, str, bytes, bool]


class MouseInteractionCreate(MouseInteractionBase):
    pass


class MouseInteractionCreateSingle(InteractionCreateBase):
    interaction: MouseInteractionCreate


class MouseInteractionCreateBulk(InteractionCreateBase):
    interactions: List[MouseInteractionCreate]


class MouseInteraction(MouseInteractionBase):
    id: int

    class Config:
        from_attributes = True


class DragEventEnum(str, Enum):
    drag = "drag"
    dragend = "dragend"
    dragenter = "dragenter"
    dragexit = "dragexit"
    dragleave = "dragleave"
    dragover = "dragover"
    dragstart = "dragstart"
    drop = "drop"


class DragInteractionBase(MouseInteractionBase):
    event: DragEventEnum


class DragInteractionCreate(DragInteractionBase):
    pass


class DragInteractionCreateSingle(InteractionCreateBase):
    interaction: DragInteractionCreate


class DragInteractionCreateBulk(InteractionCreateBase):
    interactions: List[DragInteractionCreate]


class DragInteraction(DragInteractionBase):
    id: int

    class Config:
        from_attributes = True


class TouchEnum(str, Enum):
    all = "all"
    changed = "changed"
    target = "target"


class TouchTypeEnum(str, Enum):
    direct = "direct"
    stylus = "stylus"


class TouchBase(BaseModel):
    uuid: uuid.UUID
    altitudeAngle: Optional[float] = None
    azimuthAngle: Optional[float] = None
    clientX: float
    clientY: float
    force: float
    identifier: int
    screenX: float
    screenY: float
    pageX: float
    pageY: float
    radiusX: float
    radiusY: float
    rotationAngle: float
    target: Union[dict, list, set, float, int, str, bytes, bool]
    touchType: Optional[TouchTypeEnum] = None


class TouchCreate(TouchBase):
    pass


class Touch(TouchBase):
    id: int

    class Config:
        from_attributes = True


class TouchInteractionEnum(str, Enum):
    touchstart = "touchstart"
    touchend = "touchend"
    touchmove = "touchmove"
    touchcancel = "touchcancel"


class TouchInteractionBase(BaseModel):
    uuid: uuid.UUID
    event: TouchInteractionEnum
    time: datetime
    altKey: bool
    ctrlKey: bool
    metaKey: bool
    shiftKey: bool
    metaData: Union[dict, list, set, float, int, str, bytes, bool]


class TouchInteractionCreate(TouchInteractionBase):
    changedTouches: List[TouchCreate]
    targetTouches: List[TouchCreate]
    touches: List[TouchCreate]


class TouchInteraction(TouchInteractionBase):
    id: int

    changedTouches: List[Touch]
    targetTouches: List[Touch]
    touches: List[Touch]

    class Config:
        from_attributes = True


class TouchInteractionCreateSingle(InteractionCreateBase):
    interaction: TouchInteractionCreate


class TouchInteractionCreateBulk(InteractionCreateBase):
    interactions: List[TouchInteractionCreate]


class KeyboardInteractionEnum(str, Enum):
    keydown = "keydown"
    keypress = "keypress"
    keyup = "keyup"


class KeyboardInteractionBase(BaseModel):
    uuid: uuid.UUID
    event: KeyboardInteractionEnum
    time: datetime
    altKey: bool
    code: str
    isComposing: bool
    key: str
    #locale: str
    location: int
    metaKey: bool
    repeat: bool
    shiftKey: bool
    metaData: Union[dict, list, set, float, int, str, bytes, bool]

class KeyboardInteractionCreate(KeyboardInteractionBase):
    pass


class KeyboardInteractionCreateSingle(InteractionCreateBase):
    interaction: KeyboardInteractionCreate


class KeyboardInteractionCreateBulk(InteractionCreateBase):
    interactions: List[KeyboardInteractionCreate]


class KeyboardInteraction(KeyboardInteractionBase):
    id: int

    class Config:
        from_attributes = True


class GenericInteractionBase(BaseModel):
    uuid: uuid.UUID
    event: str
    time: datetime
    data: Union[dict, list, set, float, int, str, bytes, bool]


class GenericInteractionCreate(GenericInteractionBase):
    pass


class GenericInteractionCreateSingle(InteractionCreateBase):
    interaction: GenericInteractionCreate


class GenericInteractionCreateBulk(InteractionCreateBase):
    interactions: List[GenericInteractionCreate]


class GenericInteraction(GenericInteractionBase):
    id: int

    class Config:
        from_attributes = True


class MetaInteractionCreate(BaseModel):
    interaction: GenericInteractionCreate
