"""Same output with nine loose parameters or with three objects."""

import pytest

from code_smells.bloaters.long_parameter_list import refactored, smelly
from code_smells.bloaters.long_parameter_list.refactored import Parcel, Party, Service


@pytest.mark.parametrize("express", [False, True])
@pytest.mark.parametrize("dims", [(2.0, 30, 20, 10), (1.0, 60, 40, 40)])
def test_same_shipment(express: bool, dims: tuple[float, ...]) -> None:
    old = smelly.create_shipment("Ana", "Madrid", "Luis", "Bilbao", *dims, express)
    new = refactored.create_shipment(
        Party("Ana", "Madrid"),
        Party("Luis", "Bilbao"),
        Parcel(*dims),
        Service.EXPRESS if express else Service.STANDARD,
    )
    assert old == new
