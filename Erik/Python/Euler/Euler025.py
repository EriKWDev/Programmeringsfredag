length = 1000
i = 0
previ1 = 1
previ2 = 0
n = 0

while (len(str(i)) < length):
    previ2 = previ1
    previ1 = i
    n += 1

    i = previ1 + previ2

print (n)
