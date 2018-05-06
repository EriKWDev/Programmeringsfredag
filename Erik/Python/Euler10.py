#Find the sum of all the primes below two million.

#Answer: 142915828925

def IsPrime2 (number):
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

def NextPrime (p):
    newPrime = p + 1
    while (not IsPrime2 (newPrime)):
        newPrime += 1
    return newPrime

p = 2
n = 0
while (p < 2*10**6):
    n += p
    p = NextPrime (p)

print (n)