let userName = [];

function createDomElement(ele, eleClass = '', eleId = ''){
  const element = document.createElement(ele);
  eleClass !== ''? element.setAttribute('class', eleClass): '';
  eleId !== ''? element.setAttribute('id', eleId): '';
  return element;
}

function onHomePageLoad(){
  generateHtmlForHomePage();
}

function generateHtmlForHomePage() {
  const containerHome = createDomElement('div', 'container', 'homePageContainer');
  const rowHome = createDomElement('div', 'row');
  const colHome = createDomElement('div', 'col-12 text-center homePage');

  const homePageTitle = createDomElement('h3', 'homePageTitle');
  homePageTitle.innerHtml = 'Quick Quiz';

  const playHref = createDomElement('a', 'btn btn-primary playBtn');
  playHref.text = 'Play';
  playHref.href = '/game.html';

  const highScoresHref = createDomElement('a', 'btn btn-primary highScoreBtn');
  highScoresHref.text = 'High Scores';
  highScoresHref.href = '/highScores.html';

  colHome.append(homePageTitle, playHref, highScoresHref);

  rowHome.append(colHome);
  containerHome.append(rowHome);
  document.body.append(containerHome);
}

///// 
let gameCount = 0;

async function onGamePageLoad(){
  // Fetch questions from opentdb 
  const questionsRawData = await fetchQuestions();

  //Refactor the questionsRawData
  const refactoredData = refactorQuestionsRawData(questionsRawData);

  // Generate game page layout
  generateHtmlForGamePage(refactoredData);
}

async function fetchQuestions(){
  const url = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';
  try{
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch(err){
    console.log(err);
  }
}

function refactorQuestionsRawData(questionsRawData){
  return questionsRawData.results.map(ele => {
      const obj = {};
      obj.question = ele.question;
      let count = 1;
      obj.answers = ele.incorrect_answers.map(answer => {
        return {num: count++, answer: answer, isCorrect: false}
      })   
      obj.answers.push({num: count++, answer: ele.correct_answer, isCorrect: true});
      
      return obj;
  });
}

function generateHtmlForGamePage(questionsData){
  //console.log(questionsData);
  const containerGame = createDomElement('div', 'container', 'gamePageContainer');
  const rowGame = createDomElement('div', 'row');
  const colGame = createDomElement('div', 'col-12 text-center');

  for(let i = 0; i < questionsData.length; i++ ){
    const qDiv = generateChallengeHtml(questionsData[i], i);
    colGame.append(qDiv);
  }

  colGame.append();
  rowGame.append(colGame);
  containerGame.append(rowGame);
  document.body.append(containerGame);
}

function generateChallengeHtml(challenge, index){
 // console.log(challenge.question, challenge.answers);
  const id = 'q'+index;
    const qDiv = createDomElement('div', '', id);
      const question = createDomElement('div', 'question', '');
        const questionPara = createDomElement('p');
        const questionParaText = document.createTextNode(challenge.question);
        questionPara.append(questionParaText);
      question.append(questionPara);
    qDiv.append(question);    

    challenge.answers.forEach(answerObj => {
      const answerDiv = generateAnswerHtml(answerObj);
      qDiv.append(answerDiv);
    })

  return qDiv;
} 

function generateAnswerHtml(answerObj){
 // console.log(answerObj.answer, answerObj.correct);
    const answerDiv = createDomElement('div', 'answer');
      const answerNum = createDomElement('p', 'answerNum');
      answerNumText = document.createTextNode(answerObj.num);
      answerNum.append(answerNumText);
      const answerValue = createDomElement('p', 'answerValue');
        answerValueText = document.createTextNode(answerObj.answer);
      answerValue.append(answerValueText);
    answerDiv.append(answerNum, answerValue);
    let value = answerObj.answer;
    let isCorrect = answerObj.isCorrect;
    let d = this;
    answerDiv.setAttribute('onclick',`checkAnswer(this, "${value}", "${isCorrect}")`);
  return answerDiv;
}

function checkAnswer(ele, value, isCorrect){
  console.log(ele, value, isCorrect);
  const parentElement = ele.parentElement;
  parentElement.style.pointerEvents = 'none';
  //pointer-events: none;
  if(isCorrect === "true"){
    ele.classList.add('correct');
    gameCount++;
  } else{
    ele.classList.add('wrong');
  }

  console.log(gameCount);
}

function onEndPageLoad(){
  const containerGame = createDomElement('div', 'container', 'endPageContainer');
  document.body.append(containerGame);
}


function onHighScoresPageLoad(){
  const containerGame = createDomElement('div', 'container', 'highScoresPageContainer');
  document.body.append(containerGame);
}

