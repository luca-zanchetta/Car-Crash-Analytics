# Car Crash Analytics
**Presented by:**
- Mattia Aquilina, 1921153
  [![Email](aquilina.1921153@studenti.uniroma1.it)][![GitHub](https://github.com/Mattia-Aquilina)]
- Luca Zanchetta, 1848878
  [![Email](zanchetta.1848878@studenti.uniroma1.it)][![GitHub](https://github.com/luca-zanchetta)]

## Index
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation and Launch](#installation-and-launch)

## Introduction

Welcome to **Car Crash Analytics**! This is a web application implementing a simple visualization tool that helps our intended users - mainly driving school instructors - to enhance driving safety. 

Road accidents pose significant risks to public safety and incur substantial economic costs. Analyzing
accident data is crucial for understanding the underlying causes and patterns to devise effective
interventions. This repository presents **Car Crash Analytics**, a visualization tool designed to analyze
car accident data for promoting driving safety, particularly aimed at driving school instructors. The
tool offers an interactive interface featuring geographical map, scatterplot, heatmap, and parallel
coordinates charts to identify patterns, trends, and potential risk factors associated with road accidents.
Through data pre-processing and visualization techniques, users can explore insights such as safer
areas and conditions for driving lessons. The tool’s capabilities empower instructors to make informed
decisions and contribute to reducing road accidents through evidence-based strategies. While offering
valuable insights, the tool also presents opportunities for further enhancements and collaboration with
stakeholders to advance road safety initiatives.

The architecture of the application is composed of a single **frontend** node, that is based on a **NodeJS** development server and on the **ReactJS** framework. All the system is able to run on-premise: see the [Installation and Launch](#installation-and-launch) section for further details. The whole application is based on the [**Car Accident Dataset**](https://www.kaggle.com/datasets/nextmillionaire/car-accident-dataset/data), which is a dataset providing detailed records of road accidents that
occurred during January 2021 in Kensington and Chelsea. It includes information such as the accident date, day of the
week, junction control, accident severity, geographical coordinates, lighting and weather conditions, vehicle details, and
more. The data is valuable for analyzing and understanding the factors contributing to road accidents in this urban area,
aiding in the development of strategies for improved road safety.

We strongly recommend users to have a look at our [report](https://github.com/luca-zanchetta/Car-Crash-Analytics/blob/main/Report.pdf) before the first launch of the application.

## Prerequisites
Before you begin, make sure you have the following prerequisites in place:
- **Internet Connection**: Ensure that you have an active Internet connection.
- **Git**: Git is essential for version control. If you don't have Git installed, you can download it from the official website, based on your operating system:
  - [Download Git](https://git-scm.com/downloads)
- **NodeJS**: The frontend node of our application is completely based on a NodeJS development server; therefore, if you don't have the last version of NodeJS installed, you can download it from the official website, based on your operating system:
  - [Download NodeJS](https://nodejs.org/en)

## Installation and Launch
For installing and launching the application, make sure you execute the following procedure:
1. Open a terminal or a command prompt;
2. Navigate to the folder in which you want to clone the repository;
3. Clone the GitHub repository:
   ```bash
   git clone https://github.com/luca-zanchetta/Car-Crash-Analytics
   ```
4. Navigate to the *Car-Crash-Analytics* folder from the terminal;
5. For launching the application:
   - Navigate to the *va-project* folder from the terminal:
   - **Only if it is your first launch**, execute the following command:
     ```bash
     npm install
     ```
   - Execute the following command:
     ```bash
     npm run start
     ```

**Windows users** only can alternatively execute the following procedure:
1. Open a terminal or a command prompt;
2. Navigate to the folder in which you want to clone the repository;
3. Clone the GitHub repository:
   ```bash
   git clone https://github.com/luca-zanchetta/Car-Crash-Analytics
   ```
4. Open the *Car-Crash-Analytics* folder;
5. Execute the *run.bat* batch script.

Enjoy the application! :)
