"""Same purchase and redemption flow with explicit interfaces."""

from code_smells.couplers.insider_trading import refactored, smelly


def test_same_flow() -> None:
    old_checkout, old_loyalty = smelly.Checkout(), smelly.LoyaltyProgram()
    new_checkout, new_loyalty = refactored.Checkout(), refactored.LoyaltyProgram()

    old = [old_checkout.pay("ana", 80, old_loyalty), old_loyalty.redeem("ana", old_checkout)]
    new = [new_checkout.pay("ana", 80, new_loyalty), new_loyalty.redeem("ana")]
    old += [old_checkout.pay("ana", 50, old_loyalty), old_loyalty.redeem("ana", old_checkout)]
    new += [new_checkout.pay("ana", 50, new_loyalty), new_loyalty.redeem("ana")]
    old += [old_checkout.pay("ana", 200, old_loyalty)]
    new += [new_checkout.pay("ana", 200, new_loyalty)]

    assert old == new == [80, False, 50, True, 180.0]
    assert old_loyalty._points["ana"] == new_loyalty.points("ana") == 210
