import re

def decimals(number):    
    dividend = 1
    while dividend:      
        yield dividend // number
        dividend = dividend % number * 10

current_max_length = 5000
estimated_max_match_length = 10000

for number in range(911, 0, -1):

    print("1/{} => ".format(number))
    i = 0

    decimal_string = ""
    for n in decimals(number):
        decimal_string += str(n)
        if(i > estimated_max_match_length * 2):
            break
        i += 1
    
    # print(decimal_string)
    for i in range(current_max_length, estimated_max_match_length * 2):
        re_match = re.findall(r"([0-9]{" + str(i) + r"})\1", decimal_string)
        if len(re_match) > 0:
            length_of_match = len(re_match[0])
            if(length_of_match > current_max_length):
                current_max_length = length_of_match
                print("NEW MAX!!! {}".format(current_max_length))
                break

print(current_max_length)