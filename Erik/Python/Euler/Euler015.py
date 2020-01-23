#How many routes are there through a 20×20 grid?

#Answer: 137846528820

def Factorial (n):
    x = 1
    for i in range (2, n + 1):
        x *= i
    return x

def NumberOfRoutes(n1, n2):
    return int(Factorial (n1 + n2) / (Factorial (n1) * Factorial (n2)))

print (NumberOfRoutes (3, 7))