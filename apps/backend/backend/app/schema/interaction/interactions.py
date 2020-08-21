from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from typing import Union
import uuid


class InteractionCreateBase(BaseModel):
    condition_id: int


class MouseEnum(str, Enum):
    click = "click"
    dblclick = "dblclick"
    mouseup = "mouseup"
    mousedown = "mousedown"


class MouseRelatedTargetEnum(str, Enum):
    mouseenter = "mouseenter"
    mouseleave = "mouseleave"
    mouseout = "mouseout"
    mouseover = "mouseover"
    dragenter = "dragenter"
    dragexit = "dragexit"


class MouseInteractionBase(BaseModel):
    uuid: uuid.UUID
    event: MouseEnum
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
    relatedTarget: MouseRelatedTargetEnum
    region: str


class MouseInteractionCreate(MouseInteractionBase):
    pass


class MouseInteractionCreateSingle(InteractionCreateBase):
    interaction: MouseInteractionCreate


class MouseInteractionCreateBulk(InteractionCreateBase):
    interactions: List[MouseInteractionCreate]


class MouseInteraction(MouseInteractionBase):
    id: int

    class Config:
        orm_mode = True


class TouchEnum(str, Enum):
    all = "all"
    changed = "changed"
    target = "target"


class TouchBase(BaseModel):
    uuid: uuid.UUID
    identifier: int
    screenX: float
    screenY: float
    clientX: float
    clientY: float
    pageX: float
    pageY: float
    target: str


class TouchCreate(TouchBase):
    pass


class Touch(TouchBase):
    id: int

    class Config:
        orm_mode = True


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
    rotation: Optional[float]
    scale: Optional[float]


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
        orm_mode = True


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
    locale: str
    location: int
    metaKey: bool
    repeat: bool
    shiftKey: bool


class KeyboardInteractionCreate(KeyboardInteractionBase):
    pass


class KeyboardInteractionCreateSingle(InteractionCreateBase):
    interaction: KeyboardInteractionCreate


class KeyboardInteractionCreateBulk(InteractionCreateBase):
    interactions: List[KeyboardInteractionCreate]


class KeyboardInteraction(KeyboardInteractionBase):
    id: int

    class Config:
        orm_mode = True


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
        orm_mode = True
