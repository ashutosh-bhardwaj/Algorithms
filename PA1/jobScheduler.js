// Create Readline interface to read from file
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('jobs.txt')
});
// List of all jobs
let jobs = [];

// Read file line by line and save each job in list
// File is in following format
// [number_of_jobs]
// [job_1_weight] [job_1_length]
// [job_2_weight] [job_2_length]
lineReader.on('line', function (line) {
  const job = {}; 
  const temp = line.split(' ');
  if (temp.length === 2) {
    job.weight = Number(temp[0]);
    job.length = Number(temp[1]);
  }
  jobs.push(job);
});

lineReader.on('close', function () {
  // Remove the first item as it isn't a job
  jobs.shift();
  // Call main function
  scheduler(jobs);
})


function scheduler(jobs) {
  const weightLengthRatio = calculateRatio(jobs);
  const sortedJobs = jobs.sort(compareFn);
  const completionTime = calculateCompletionTime(sortedJobs);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const TotalCompletionTime = completionTime.reduce(reducer);
  console.log('Total Time', TotalCompletionTime);
}

/**
 * compare elements in the list based on their corresponding
 * ratio of weight to length
 * 
 * @param {*} a, first element 
 * @param {*} b, second element
 * 
 * @return -1 if a should come first than b or
 *          1 if b should come first than b in the list 
 */
function compareFn(a,b) {
  if ((a.weight / a.length) > (b.weight / b.length)) {
    return -1;
  } else if ((a.weight / a.length) < (b.weight / b.length)) {
    return 1;
  } else {
    return a.weight > b.weight ? -1 : 1;
  }
}

function calculateCompletionTime(list) {
  let time = 0;
  let completionTime = []; 
  list.forEach( job => {
    completionTime.push(job.weight * (job.length + time));
    time += job.length;
  });
  return completionTime;
}

function calculateDelta(jobs) {
  return jobs.map( job => job.difference = job.weight - job.length);
}

function calculateRatio(jobs) {
  return jobs.map( job => job.difference = job.weight / job.length);  
}