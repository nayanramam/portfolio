# Team Lead + Lead Researcher | Math Modeling Student Research Group

## About

The Math Modeling Student Research Group is a club comprised of over a dozen small, entirely student-led, research teams applying math modeling to a broad range of subjects, from election forecasting to supply chain risk analysis. My team emerged as something of an outlier, as our work has nothing to do wih math modeling; we were merely formed through the club and rely on some of the experienced Ph.D. students for advice. My team explores mechanistic interpretability; initially in convolutional neural networks and now in large language models as well.

## Paper 1

Our first paper, which we are currently working towards presenting at a workshop in ICLR and publishing in The Tower (Georgia Tech's undergraduate research journal), presents a framework for quantifying polysemanticity. Polysemanticity is a phenomemon in neural networks where one neuron is activated by several disparate features. Identifying instances of polysemantic neurons rapidly and on a large scale aids in building interpretable networks.

We go into finer detail in our paper, but on a high level, our methodology is as follows:

1. Create a set of feature visualizations for the neuron being analyzed. Feature visualizations are images generated via gradient ascent (the opposing process to gradient descent, which is used for training neural networks). The idea is to capture all the features that activate the neuron in these images. The process of deciding how many feature visualizations to make revolves around elbow detection -- in essence, we make more images until the change in average similarity between the images becomes very low.
2. Embed the feature visualizations. We use ResNet to turn the images into 512-dimension vectors. Aside from being in vector form, making numerical manipulation easy, embedding also provides semantic meaning into each dimension. In the next steps, we take advantage of the fact that each dimension is encoding some trait of the image, and that trait is common to the corresponding dimension in the other embeddings.
3. Cluster the feature visualizations. Using KMeans clustering and the Bayesian Information Criterion as a stopping condition to pick cluster count, we split the visualizations (which are now embedded vectors) into like groups.
4. Apply our scoring formula. We developed a custom formula that factors in cluster count and angular diversity (i.e. how different the clusters are and the distribution of the strength of features) to give a value between 0 and 1, with 0 being maximally monosemantic and 1 being maximally polysemantic.

### My Role

I was responsible for the majority of the work on this paper. My teammate presented the initial idea of generating feature visualizations, and upon that I expanded the framework to include the elbow detection, embedding, clustering, and scoring. I developed the formula from scratch, and implemented all of the aforementioned items in code. I also optimized the feature visualization code, adding in features to ensure diversity. I developed a script to generate PDF reports with a compilation of relevant information that we used for debugging and output analysis. I also wrote scripts that allowed us to perform batch testing on an HPC, both for testing a range of possible parameters and bulk testing for evaluation of our metric's accuracy. Additionally, as the team lead I am responsible for assigning tasks to the team, coordinating meetings, and roadmapping the project.


## Paper 2

I recently proposed the beginning of a new venture into large language models. We are still unsure of a precise idea for a novel project, but current areas of interest include cross-layer transcoders, sparse autoencoders, feature steering, and circuit detection/visualization. I planned on leading the project and eventual push for publication, but as I have shifted my career focus towards analog mixed-signal design, I have considered giving up that role.


## Tools Used
- Python
- PyTorch
- TransformerLens
- OpenCLT
- NumPy

## Skills Demonstrated
- Research team leadership
- Mechanistic interpretability
- Gradient ascent
- Image embedding
- KMeans/XMeans/GMeans clustering
- Research paper writing and publication

## Publications
- <a href="../../assets/experiences/Neuron_Interpretability_Paper-2.pdf" target="_blank" rel="noopener noreferrer">Quantifying Polysemanticity in Convolutional Neural Networks</a> (Currently working towards publication in ICLR)

