#If all the numbers from 1 to 1000 (one thousand) inclusive were written out in words, how many letters would be used?

#Answer: 21124

def NTW (n, zero = True, l = ""):
    if (n < 20):
        t = [
            "zero" if zero else "",
            "one","two","three","four","five","six","seven","eight", "nine","ten","eleven","twelve","thirteen","fourteen","fifteen", "sixteen","seventeen","eighteen","nineteen",
        ]
        return t[n] if zero else l + t[n]
    elif (n <= 99):
        N = list(str(n))
        t = [
            "","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety",
        ]

        return t[int(N[0])] if int(N[1]) == 0 else t[int(N[0])] + NTW (int(N[1]), 0, "-")
    elif (n <= 999):
        N = list(str(n))
        return NTW (int(N[0])) + " hundred" if int(N[1]+N[2]) == 0 else NTW (int(N[0])) + " hundred and " + NTW (int(N[1]+N[2]))
    elif (n <= 9999):
        N = list(str(n))
        return NTW (int(N[0])) + " thousand " + NTW (int(N[1]+N[2]+N[3]), 0)

letters = 0
for i in range (1, 1001):
    print (i," -> ",NTW (i))
    letters += len (NTW (i).replace(" ", "").replace("-", ""))

print (letters)
