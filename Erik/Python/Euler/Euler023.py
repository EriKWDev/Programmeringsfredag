#Answer:

import math

def ProperDivisorSum (n) :
    result = 0
    i = 2
    while i<= (math.sqrt (n)) :
        if (n % i == 0) :
            if (i == (n/i)) :
                result += + i
            else :
                result += (i+n/i)
        i = i + 1
    return (result + 1)

listOfNumbers = []

for n in range (1, 28123) :
    if ProperDivisorSum (n) > n :
        listOfNumbers.append (n)

print(listOfNumbers)
