FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

#RUN useradd --create-home stdyctrl
#WORKDIR /home/stdyctrl
#USER stdyctrl

COPY ./app/requirements.txt /app
RUN pip install --upgrade pip
RUN pip install  --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app

# setup python logging environment
RUN mkdir /var/log/studyalign
RUN cat >log.log
