

test = async (f, input, output) => {
    var start = new Date()
    try {
        let answer = await f(input)
    } catch (error) {
        
    }
    var end = new Date() - start

    let result = answer == output

    if(result == false && answer.length != null) {
        result = true
        for(let i in answer) {
            if(answer[i] != output[i]) {
                result = false
            }
        }
    }

    console.log(`[${result ? "\x1b[32mSUCCESS\x1b[0m" : "\x1b[31mFAILURE\x1b[0m"}] Gave ${answer}, expected: ${output} | ${end}ms`)
    return answer == output
}

exports.runTests = async (testCases=[]) => {
    if(testCases.length == 0) {
        console.log("No tests provided")
        return
    }

    let results = []

    console.log()
    console.log("___ Running Tests: _____________________________________________")
    console.log()
    for(let testCase of testCases) {
        let result = await test(testCase[0], testCase[1], testCase[2])

        results.push({successfull: result, input: testCase[0]})
    }
    console.log()
    let successfullCases = 0
    for(result of results) {
        if(result.successfull) {
            successfullCases++
        }
    }

    console.log(`${successfullCases}/${testCases.length}`)
    console.log("________________________________________________________________")
}