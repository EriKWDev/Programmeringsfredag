#Find the sum of all the multiples of 3 or 5 below 1000.

#Answer: 233168

n = 0
for i in range (0, 1000):
    if (i % 3 == 0 or i % 5 == 0):
        n += i

print (n)