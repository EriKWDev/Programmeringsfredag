#Let d(n) be defined as the sum of proper divisors of n (numbers less than n which divide evenly into n).
#If d(a) = b and d(b) = a, where a is not equal to b, then a and b are an amicable pair and each of a and b are called amicable numbers.
#Evaluate the sum of all the amicable numbers under 10000.

#Answer: 31626

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

def SumAllAmicableNumbersBelow (n) :
    a = 0
    for i in range (0, n) :
        if ProperDivisorSum (ProperDivisorSum (i)) == i and ProperDivisorSum (i) != i:
            print i
            a += i
    return a

print SumAllAmicableNumbersBelow (10000)
