export function heuristicsEvaluator(answers) {
    let table = {
        header: [],
        items: []
    };
    let options = answers.options.map(op => op.value);
    let max = Math.max(...options);
    let min = Math.min(...options);
    let resultEvaluator = statistics(answers)
    table.header.push({
        text: "Heuristics",
        align: "start",
        value: "heuristic"
    });

    if (resultEvaluator) {
        resultEvaluator.forEach(evaluator => {
            let header = table.header.find(h => h.text == evaluator.id);
            if (!header) {
                table.header.push({
                    text: evaluator.id,
                    align: "center",
                    value: evaluator.id
                });
            }
            evaluator.heuristics.forEach(heuristic => {
                let item = table.items.find(i => i.heuristic == heuristic.id);
                if (item) {
                    Object.assign(item, { [evaluator.id]: heuristic.result });
                } else {
                    table.items.push({
                        heuristic: heuristic.id,
                        max: max * heuristic.totalQuestions,
                        min: min * heuristic.totalQuestions,
                        [evaluator.id]: heuristic.result
                    });
                }
            });
        });
    }
    return table;
}

export function heuristicsStatistics(answers) {
    let table = {
        header: [],
        items: []
    };
    let data = heuristicsEvaluator(answers)
    table.header = [
        {
            text: "Heuristics",
            align: "start",
            sortable: false,
            value: "name"
        },
        { text: "Average", value: "average", align: "center" },
        { text: "Standard deviation", value: "sd", align: "center" },
        { text: "Max", value: "max", align: "center" },
        { text: "Min", value: "min", align: "center" }
    ];
    if (data) {
        data.items.forEach(item => {
            let results = Object.entries(item)
                .filter(item => item[0].includes("Ev"))
                .map(item => item[1]);

            table.items.push({
                name: item.heuristic,
                max: Math.max(...results).toFixed(2),
                min: Math.min(...results).toFixed(2),
                sd: standardDeviation(results).toFixed(2),
                average: results
                    .reduce((total, value) => total + value / results.length, 0)
                    .toFixed(2)
            });
        });
    }

    return table;
}

export function evaluatorStatistics(answers) {
    let table = {
        header: [],
        items: []
    };
    let resultEvaluator = statistics(answers)
    table.header = [
        {
            text: "Evaluator",
            align: "start",
            sortable: false,
            value: "evaluator"
        },
        { text: "Usability Percentage", value: "result", align: "center" },
        { text: "Applicable Question", value: "aplication", align: "center" },
        {
            text: "No Applicable Question",
            value: "noAplication",
            align: "center"
        },
        { text: "Conclusion Percentage", value: "answered", align: "center" }
    ];

    if (resultEvaluator) {
        resultEvaluator.forEach(evaluator => {
            let totalNoAplication = 0;
            let totalNoReply = 0;
            let totalQuestions = 0;

            evaluator.heuristics.forEach(heuristic => {
                totalNoAplication += heuristic.totalNoAplication;
                totalNoReply += heuristic.totalNoReply;
                totalQuestions += heuristic.totalQuestions;
            });

            table.items.push({
                evaluator: evaluator.id,
                result: evaluator.result,
                aplication: totalQuestions - totalNoAplication,
                noAplication: totalNoAplication,
                answered: (percentage(
                    totalQuestions - totalNoReply,
                    totalQuestions
                )).toFixed(2)
            });
        });
    }

    return table;
}

export function finalResult(answers) {
    let testData = {
        average: null,
        max: null,
        min: null,
        sd: null
    };
    let data = evaluatorStatistics(answers)
 

    if (data.items.length) {
        let res = data.items.reduce((total, value) => {
            return total + value.result / data.items.length;
        }, 0);

        testData.average = `${Math.fround(res).toFixed(1)}%`;

        testData.max = `${Math.max(
            ...data.items.map(item => item.result)
        ).toFixed(1)}%`;

        testData.min = `${Math.min(
            ...data.items.map(item => item.result)
        ).toFixed(1)}%`;

        testData.sd = `${standardDeviation(
            data.items.map(item => item.result)
        ).toFixed(1)}%`;
    }

    return testData;
}

function statistics(data) {
    let answers = data.answers
    let resultEvaluator = [];

    //Get Evaluator answers
    let evaluatorIndex = 1;
    answers.forEach(evaluator => {
        let SelectEvaluator = resultEvaluator.find(
            e => e.id == `Ev${evaluatorIndex}`
        );
        if (!SelectEvaluator) {
            resultEvaluator.push({
                uid: evaluator.uid,
                email: evaluator.email,
                id: `Ev${evaluatorIndex}`,
                heuristics: [],
                result: 0
            });
            SelectEvaluator = resultEvaluator[
                resultEvaluator.length - 1
            ];
        }
        //Get Heuristics for evaluators
        let heurisIndex = 1;
        evaluator.heuristics.forEach(heuristic => {
            //Get Questions for heuristic

            let noAplication = 0;
            let noReply = 0;
            let res = heuristic.questions.reduce((totalQuestions, question) => {
                //grouping of answers
                if (question.res === null) {
                    noAplication++;
                } //count answers no aplication
                if (question.res === "") noReply++;
                return totalQuestions + Number(question.res); //sum of responses
            }, 0);
            if (noAplication == heuristic.questions.length) res = null;

            SelectEvaluator.heuristics.push({
                id: `H${heurisIndex}`,
                result: res,
                totalQuestions: heuristic.total,
                totalNoAplication: noAplication,
                totalNoReply: noReply
            });
            heurisIndex++;
        });
        evaluatorIndex++;
    });

    //Calc Final result
    resultEvaluator.forEach(ev => {
        ev.result = calcFinalResult(ev.heuristics, data.options);
    });

    return resultEvaluator
}

function calcFinalResult(array, options) {
    let result = 0;
    let qtdQuestion = 0;
    let qtdNoAplication = 0;
    let maxOption = Math.max(...options.map(item => item.value));
    array.forEach(res => {
        (result += res.result), (qtdQuestion += res.totalQuestions);
        qtdNoAplication += res.totalNoAplication;
    });
    let perfectResult = (qtdQuestion - qtdNoAplication) * maxOption;

    return ((result * 100) / perfectResult).toFixed(1);
}

function standardDeviation(array) {
    let average = array.reduce(
        (total, value) => total + value / array.length,
        0
    );
    return Math.sqrt(
        array.reduce(
            (total, valor) => total + Math.pow(average - valor, 2) / array.length,
            0
        )
    );
}

function percentage(value, result) {
    return (value * 100) / result;
}

