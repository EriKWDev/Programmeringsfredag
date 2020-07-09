import re

def decimals(number):    
    dividend = 1
    while dividend:      
        yield dividend // number
        dividend = dividend % number * 10

def is_prime(number):
    if (number <= 1):
        return False
    elif (number <= 3):
        return True
    elif (number % 2 == 0 or number % 3 == 0):
        return False
    i = 5
    while (i * i <= number):
        if (number % i == 0 or number % (i + 2) == 0):
            return False
        i += 6
    return True

estimated_max_match_length = 50

for number in range(1000, 0, -1):
    if not is_prime(number):
        continue

    i = 0

    decimal_string = ""
    for n in decimals(number):
        decimal_string += str(n)
        if(i > estimated_max_match_length * 2):
            break
        i += 1
    decimal_string = decimal_string[1:]
    
    print("1/{} => .{}".format(number, decimal_string))

print()
print("######## ---------- ##########")
print()