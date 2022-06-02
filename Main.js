const {Worker} = require("worker_threads");

const data = [
    {url : "https://archive.org/details/manuals?&sort=titleSorter&page=1"},
    {url : "https://archive.org/details/manuals?&sort=titleSorter&page=2"},
    {url : "https://archive.org/details/manuals?&sort=titleSorter&page=3"}
]

async function runWorker(obj) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./workerThread', {
            workerData : obj
        })

        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0) reject(new Error("something go wrong"));
        })
    })
}

data.forEach(obj => {
    runWorker(obj).then(data => {
        if (data) {
            console.log(data)
        }
    })
})



function resetAtMidnight() {
    let now = new Date();
    let night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        6, 0, 0 // ...at 00:00:00 hours
    );

    let msToMidnight = night.getTime() - now.getTime();

    setTimeout(function() {
        data.forEach(obj => {
            runWorker(obj).then(data => {
                if (data) {
                    console.log(data)
                }
            })
        })           //      <-- This is the function being called at midnight.
        resetAtMidnight();    //      Then, reset again next midnight.
    }, msToMidnight);
}

resetAtMidnight();


