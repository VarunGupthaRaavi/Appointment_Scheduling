from pydantic import BaseModel, Field

class AppointmentReservationInput(BaseModel):
    especialidad: float = Field(76.0, description="Specialty code")
    edad: float = Field(45.0, description="Patient age")
    sexo: float = Field(1.0, description="Gender code")
    reserva_mes_d: float = Field(5.0, description="Reservation month discrete")
    reserva_mes_c: float = Field(0.86, description="Reservation month continuous/transformed")
    reserva_dia_d: float = Field(12.0, description="Reservation day discrete")
    reserva_dia_c: float = Field(0.5, description="Reservation day continuous/transformed")
    reserva_hora_d: float = Field(14.0, description="Reservation hour discrete")
    reserva_hora_c: float = Field(0.2, description="Reservation hour continuous/transformed")
    creacion_mes_d: float = Field(5.0, description="Creation month discrete")
    creacion_mes_c: float = Field(0.86, description="Creation month continuous/transformed")
    creacion_dia_d: float = Field(1.0, description="Creation day discrete")
    creacion_dia_c: float = Field(-0.8, description="Creation day continuous/transformed")
    creacion_hora_d: float = Field(9.0, description="Creation hour discrete")
    creacion_hora_c: float = Field(-0.9, description="Creation hour continuous/transformed")
    latencia: float = Field(11.0, description="Lead time / latency days")
    canal: float = Field(1.0, description="Booking channel ID")
    tipo: float = Field(1.0, description="Appointment type ID")

    class Config:
        json_schema_extra = {
            "example": {
                "especialidad": 76.0,
                "edad": 45.0,
                "sexo": 1.0,
                "reserva_mes_d": 5.0,
                "reserva_mes_c": 0.86,
                "reserva_dia_d": 12.0,
                "reserva_dia_c": 0.5,
                "reserva_hora_d": 14.0,
                "reserva_hora_c": 0.2,
                "creacion_mes_d": 5.0,
                "creacion_mes_c": 0.86,
                "creacion_dia_d": 1.0,
                "creacion_dia_c": -0.8,
                "creacion_hora_d": 9.0,
                "creacion_hora_c": -0.9,
                "latencia": 11.0,
                "canal": 1.0,
                "tipo": 1.0
            }
        }
