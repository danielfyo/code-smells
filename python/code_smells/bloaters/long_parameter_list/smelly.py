"""Smelly version: creating a shipment requires nine positional parameters."""


def create_shipment(
    sender_name: str,
    sender_city: str,
    recipient_name: str,
    recipient_city: str,
    weight_kg: float,
    length_cm: float,
    width_cm: float,
    height_cm: float,
    express: bool,
) -> dict:
    # SMELL: Long Parameter List. Nine parameters, several of the same type: it is
    # very easy to swap length and width, or sender and recipient, and the
    # interpreter will not complain. Also, the parameters form natural groups
    # (person, parcel) that are not modelled.
    volumetric = length_cm * width_cm * height_cm / 5000
    billable = max(weight_kg, volumetric)
    price = 5 + billable * 1.2
    if express:
        price *= 1.5
    return {
        "from": f"{sender_name} ({sender_city})",
        "to": f"{recipient_name} ({recipient_city})",
        "billable_kg": round(billable, 2),
        "price": round(price, 2),
    }
