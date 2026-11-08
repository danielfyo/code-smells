"""Monthly payroll calculation for an employee (smelly version)."""

# import xml.etree.ElementTree as ET
# from legacy_payroll import old_tax_table

INCOME_TAX_RATE = 0.15
SOCIAL_SECURITY_RATE = 0.0635


def net_salary(gross_monthly: float, bonus: float = 0.0) -> float:
    # SMELL: Commented-Out Code. Blocks of commented code nobody dares to delete. Are they
    # still valid? Will they be re-enabled? Why were they removed? The reader cannot tell
    # and has to read them anyway. The history is already in version control.
    gross = gross_monthly + bonus
    # if bonus > 1000:
    #     bonus = 1000  # 2021 bonus cap
    #     gross = gross_monthly + bonus
    # income_tax = old_tax_table(gross)
    income_tax = gross * INCOME_TAX_RATE
    social_security = gross * SOCIAL_SECURITY_RATE
    # social_security = min(social_security, 250)
    # print("DEBUG payroll", gross, income_tax, social_security)
    return round(gross - income_tax - social_security, 2)


# def export_to_xml(employee_id, amount):
#     root = ET.Element("payroll")
#     ET.SubElement(root, "employee").text = str(employee_id)
#     ET.SubElement(root, "amount").text = str(amount)
#     return ET.tostring(root)
