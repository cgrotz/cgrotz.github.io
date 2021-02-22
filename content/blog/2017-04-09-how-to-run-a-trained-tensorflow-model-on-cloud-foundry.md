---
layout: post
title:  "How to run a trained Tensorflow model on Cloud Foundry"
date:   2017-04-09 10:13:00 +0200
categories: Cloud General "Machine Learning" Tensorflow
type: blog
---
AI models are becoming more and more commodity nowadays. This entry is focusing on, how you can train a Tensorflow model offline and push it to Cloud Foundry to provide your model as an API. Our starting point is the very good beginner sample for MNIST image recognition from Tensorflow itself [MNIST Getting Started][Tensorflow MNIST Getting Started]

You can get the sources of this examples from my Github repository. [Source on GitHub][Sources]

The first thing to do, is to add the following lines at the end of your training code:

{% highlight python %}
saver = tf.train.Saver()
saver.save(sess, "model/trained.ckpt")
{% endhighlight %}

This saves the currently trained model into the folder model as the trained checkpoint. Which allows you to reload the model later.

The next step is to create a web application that is able to load the model and provide an API to it. For this we are going to use [Flask][Flask]. Flask is a microframework for Python, that provides the possibility to quickly and easily provide HTTP APIs. To install flask you can simply use pip (e.g. pip install Flask).

You can see the whole code in the run.py file. I’m going to highlight the main points here.

First of all, we need to normally init the variables and model we are going to run.

{% highlight python %}
# This is the model
x = tf.placeholder(tf.float32, [None, 784])
W = tf.Variable(tf.zeros([784, 10]), name = 'W')
b = tf.Variable(tf.zeros([10]), name = 'b')
y = tf.nn.softmax(tf.matmul(x, W) + b)
{% endhighlight %}

Next we are going to load the previously stored value for the variables. This recreates the model we previously trained.

{% highlight python %}
#Load the stored model
saver = tf.train.Saver()
saver.restore(sess, "model/trained.ckpt")
{% endhighlight %}

Afterwards we create our Flask request handler.

{% highlight python %}
#A request handler for calling the Tensorflow model
@app.route('/', methods=['POST'])
def process_call():
    #prepare the model
    input = ((255 - np.array(request.get_json(), dtype=np.uint8)) / 255.0).reshape(1, 784)
    #execute the model and respond the result as JSON
    return jsonify(
        sess.run(y, feed_dict={x: input}).flatten().tolist()
    )
{% endhighlight %}

That’s all, if you have installed Tensorflow and Flask you can now simply run python run.py  to start the API locally.

The next step is to deploy our simple application to Cloud Foundry. I assume you already have either a Cloud Foundry installation up and running or have an account with run.pivotal.io. Also you should have setup your cf-cli tool to point to this installation.

We are going to add Gunicorn. Gunicornis a Python HTTP Server and provides a pre-fork worker model. The Gunicorn server provides a great basis for Python web applications with it’s worker model and is widely used. And a great match for running Python on Cloud Foundry.

Our application is now like every other Python app, we want to run on Cloud Foundry. There are 3 key files, that we need to know about, in order for the Cloud Foundry buildpack to identify our app as a Python app and package it correctly.

requirements.txt – This file contains the libraries that PIP should install. PIP is run by the Python buildpack while creating the droplet. The content should look like the following lines:

{% highlight python %}
tensorflow==1.0.1
Flask==0.12.1
gunicorn==19.7.1
{% endhighlight %}

runtime.txt – This file contains which Python version to use. Our example needs python 3.4 to run. The content should look like the following lines:

{% highlight python %}
python-3.6.0
{% endhighlight %}

Procfile – This file gives the command line with which the buildpack should start the application

{% highlight python %}
web: gunicorn run:app --log-file=-
{% endhighlight %}

When you have configured those files, you can simple push your app using cf-cli from the folder:

{% highlight sh %}
cf push <app_name>
{% endhighlight %}

Now let’s make a test request to our  AI API. For example the following json array is the letter 3 or at least my painting of the letter 3 using paint and a touchpad.

{% highlight json %}
[ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 
  0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
  1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 
  1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
{% endhighlight %}

You can simply POST it against your newly created Cloud Foundry app,  just set the Content-Type header to application/json so that the content is automatically read. The response should look like the following

{% highlight json %}
[
   0.0000050957642088178545,
   1.7136410376778844e-15,
   0.14846764504909515,
   0.813301682472229,
   3.0202426930941995e-12,
   0.03664221242070198,
   2.5848851237242343e-7,
   6.163446641949122e-8,
   0.0015830846969038248,
   5.507514888591913e-9
]
{% endhighlight %}

In this example the 3 was actually correctly detected, hurray. Of course you can make the API fancier and maybe add some authentication and authorisation to it. Maybe you also want to add a billing option to earn some money with your awesome model.

Ideally you automate the training of the model using for example Jenkins to automatically re-train and re-deploy the model if the newer version has a higher accuracy.


[Flask]: http://flask.pocoo.org/
[Tensorflow MNIST Getting Started]: https://www.tensorflow.org/get_started/mnist/beginners
[Sources]: https://github.com/cgrotz/tensorflow-cloudfoundy