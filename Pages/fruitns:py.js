fruit_dictionary = {
    "Apple": {
        "Value": 10,
        "Sales": 0,
        "Expected_Sales": 0,
        "Income": 0,
    },
    "Pair": {
        "Value": 5,
        "Sales": 0,
        "Expected_Sales": 0,
        "Income": 0,
    },
    "Grape": {
        "Value": 2,
        "Sales": 0,
        "Expected_Sales": 0,
        "Income": 0,
    },
    "Banana": {
        "Value": 7,
        "Sales": 0,
        "Expected_Sales": 0,
        "Income": 0,
    },
    "Mango": {
        "Value": 21,
        "Sales": 0,
        "Expected_Sales": 0,
        "Income": 0,
    },
}

def collect_sales(fruit):
    print(f'\n------{fruit}s------\n')
    
    amount_sold = int(input(f'How many {fruit}s did you sell today? \n\n'))
    fruit_dictionary[fruit]["Sales"] = amount_sold
    
    expected_sales = int(input(f'\nHow much {fruit} did you expect to sell today? \n\n'))
    fruit_dictionary[fruit]["Expected_Sales"] = expected_sales
    
    income_from_fruit = amount_sold * fruit_dictionary[fruit]["Value"]
    fruit_dictionary[fruit]["Income"] = income_from_fruit

def evaluate_sales(fruit):
    print(f'\n----{fruit}s----\n')
    print(f'Today you sold {fruit_dictionary[fruit]["Sales"]} {fruit}s.\n')
    
    if fruit_dictionary[fruit]["Sales"] < fruit_dictionary[fruit]["Expected_Sales"]:
        print(f'Today you sold {fruit_dictionary[fruit]["Expected_Sales"]-fruit_dictionary[fruit]["Sales"]} less {fruit}s than expected.\n')
    elif fruit_dictionary[fruit]["Sales"] > fruit_dictionary[fruit]["Expected_Sales"]:
        print(f'Today you sold {fruit_dictionary[fruit]["Sales"]-fruit_dictionary[fruit]["Expected_Sales"]} more {fruit}s than expected.\n')
    else:
        print(f'Today you sold the expected amount of {fruit}s.\n')

    print(f'Today you made £{fruit_dictionary[fruit]["Income"]} from selling {fruit}s.\n')

def total_evaluation():
    print(f'\n----Summary----\n')
    total_sales = 0
    for fruit in fruit_dictionary:
        total_sales += fruit_dictionary[fruit]["Sales"]
    total_income = 0
    for fruit in fruit_dictionary:
        total_income += fruit_dictionary[fruit]["Income"]
    print(f'In total today you sold {total_sales} fruits and made a total of £{total_income}.')
    

for fruit in fruit_dictionary:
    collect_sales(fruit)

print(f'\n------Day Summary------\n')

for fruit in fruit_dictionary:
    evaluate_sales(fruit)

total_evaluation()
    


    
    