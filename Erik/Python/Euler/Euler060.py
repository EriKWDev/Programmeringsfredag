
is_prime_storage = {}

def is_prime (number):
    if number in is_prime_storage.keys():
        return is_prime_storage[number]

    if (number <= 1):
        is_prime_storage[number] = False
        return False
    elif (number <= 3):
        is_prime_storage[number]  = True
        return True
    elif (number % 2 == 0 or number % 3 == 0):
        is_prime_storage[number] = False
        return False
    i = 5
    while (i * i <= number):
        if (number % i == 0 or number % (i + 2) == 0):
            is_prime_storage[number] = False
            return False
        i += 6
    is_prime_storage[number] = True
    return True

next_prime_storage = {}

def next_prime (p):
    if p in next_prime_storage.keys():
        return next_prime_storage[p]

    new_prime = p + 1
    while (not is_prime (new_prime)):
        new_prime += 1
    
    next_prime_storage[p] = new_prime
    return new_prime

combination_storage = {}

def test_combinations(combos):
    for n in combos:
        if(combos.count(n) > 1):
            return False

    for x in combos:
        for y in combos:
            if(x == y):
                if(is_prime(x)):
                    continue
                else:
                    return False

            combo1 = int("{}{}".format(y, x))
            combo2 = int("{}{}".format(x, y))
            
            if(combo1 in combination_storage.keys()):
                if(combination_storage[combo1] == False):
                    return False
            
                if(combination_storage[combo1] == True):
                    continue
            elif(combo2 in combination_storage.keys()):
                if(combination_storage[combo2] == False):
                    return False
            
                if(combination_storage[combo2] == True):
                    continue

            if is_prime(combo1) is False:
                combination_storage[combo2] = False
                return False

            elif is_prime(combo2) is False:
                combination_storage[combo2] = False
                return False

            combination_storage[combo1] = True
            combination_storage[combo2] = True
    return True

a = next_prime(2)
b = a
c = a
d = a
e = a

done = False

# 7 + 1237 + 2341 + 12409 + 18433 = 34427
# 13 + 5197 + 5701 + 6733 + 8389 = 26033
print(test_combinations([7, 1237, 2341, 12409, 18433]))

while not done:
    if test_combinations([a]):
        if test_combinations([a, b]):
            if test_combinations([a, b, c]):
                if test_combinations([a, b, c, d]):
                    # print(a, b, c, d, e)
                    if test_combinations([a, b, c, d, e]):
                        done = True
                    else:
                        e = next_prime(e)
                else:
                    d = next_prime(d)
            else:
                c = next_prime(c)
        else:
            b = next_prime(b)
    else:
        a = next_prime(a)

print(a, b, c, d, e)