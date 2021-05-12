const queue= require('../config/kue');

const postsMailer= require('../mailers/posts_mailers');

//defining the process for executing jobs in the queue
//name of queue is written in first argument of queue.process => 'emails'
queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);
    postsMailer.newPost(job.data);
    done();
})