function createDomElement(ele, eleClass = '', eleId = ''){
  const element = document.createElement(ele);
  eleClass !== ''? element.setAttribute('class', eleClass): '';
  eleId !== ''? element.setAttribute('id', eleId): '';
  return element;
}

/////////////////////////////////////// JS code for home.html///////////////////////
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
/////////////////////////////////////// JS code for home.html END///////////////////////

/////////////////////////////////////// JS code for game.html START///////////////////////
let scoreCount = 0;
let qsDone = 0;

async function onGamePageLoad(){
  // Fetch questions from opentdb 
  const questionsRawData = await fetchQuestions();

  //Refactor the questionsRawData
  const refactoredData = refactorQuestionsRawData(questionsRawData);

  // Generate game page layout
  generateHtmlForGamePage(refactoredData);

  //Set Game Initial Configs
  setGameConfig();
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
  const resultsDiv = generateResultsHtml();
  colGame.append(resultsDiv);

  for(let i = 0; i < questionsData.length; i++ ){
    const qDiv = generateChallengeHtml(questionsData[i], i);
    colGame.append(qDiv);
  }

  colGame.append();
  rowGame.append(colGame);
  containerGame.append(rowGame);
  document.body.append(containerGame);
}

function generateResultsHtml(){
    const div = createDomElement('div', 'results');
      const divQsDone = createDomElement('div');
        const pQsDoneText = createDomElement('p');
        pQsDoneText.append(document.createTextNode('Questions Done'));
        const pQsDone = createDomElement('p', '', 'qsDone');
        pQsDone.innerHTML = '0/10';
      divQsDone.append(pQsDoneText, pQsDone);  

      const divResultsRange = createDomElement('div');
        const pResultsRangeText = createDomElement('p');
        pResultsRangeText.append(document.createTextNode('Range'));
        const progressResultsRange = createDomElement('progress', '', 'progressResultsRange');
        progressResultsRange.value = 0;
        progressResultsRange.max = 10;
      divResultsRange.append(pResultsRangeText, progressResultsRange);  

      const divScore = createDomElement('div');
        const pScoreText = createDomElement('p');
        pScoreText.append(document.createTextNode('Score'))
        const pScore = createDomElement('p', '', 'pScore');
        pScore.innerHTML = 0;
      divScore.append(pScoreText, pScore);

      div.append(divQsDone, divResultsRange, divScore);
    return div;
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
    answerDiv.setAttribute('onclick',`updateResults(this, "${value}", "${isCorrect}")`);
  return answerDiv;
}

function setGameConfig(){
  scoreCount = 0;
  questionsAnswered = 0;
  if(localStorage.getItem('score')){
    localStorage.setItem('score', null);
  }
} 

function updateResults(ele, value, isCorrect){
  console.log(ele, value, isCorrect);
  const parentElement = ele.parentElement;
  parentElement.style.pointerEvents = 'none';
  //pointer-events: none;
  if(isCorrect === "true"){
    ele.classList.add('correct');
    scoreCount++;
    console.log(scoreCount);
  } else{
    ele.classList.add('wrong');
  }

  questionsAnswered++;
  document.getElementById('qsDone').innerHTML = `${questionsAnswered}/10`
  document.getElementById('pScore').innerHTML = scoreCount; 
  document.getElementById('progressResultsRange').value = scoreCount;
  
  updateLocalStorage(scoreCount);
  
  if(questionsAnswered === 10){
    movetoEndPage();
  }
}

function updateLocalStorage(scoreCount){
    localStorage.setItem('score', scoreCount);
}

function movetoEndPage(){
  setTimeout(()=>{
    window.location.replace("/end.html");
  }, 3000);
}

function onEndPageLoad(){
  updateScoreInEndPage();
}

function updateScoreInEndPage(){
  if(localStorage.getItem('score') !== null){
    document.getElementById('score').innerHTML = 'Score '+localStorage.getItem('score');
  }
}

function enableSave(){
  const userName = document.getElementById('userName').value;
  if(userName){
    document.getElementById('saveBtn').disabled = false;
  } else {
    document.getElementById('saveBtn').disabled = true;
  }
}

function saveScore(){
  let highScores = [];
  if(localStorage.getItem('highScores')){
    highScores = JSON.parse(localStorage.getItem('highScores'));
  } else {
    highScores = [];
  }
  const score = localStorage.getItem('score');
  const userName = document.getElementById('userName').value;
  const highScore = {userName, score}
  highScores.push(highScore);
  localStorage.setItem('highScores', JSON.stringify(highScores));
}


function onHighScoresPageLoad(){
  populateHighScoresList();
}

function populateHighScoresList(){
  if(localStorage.getItem('highScores')){
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    highScores.map(highScore => {
      console.log(highScore.userName, highScore.score);
    });

    generateHighScoresList(highScores);

  }
}

function generateHighScoresList(highScores){
  highScores.forEach(highScore => {
    const div = createDomElement('div', 'highScoresList border mt-5');
      const pUserName = createDomElement('p','border');
      pUserName.innerHTML = highScore.userName;
      const pScore = createDomElement('p','border');
      pScore.innerHTML = highScore.score; 
    div.append(pUserName,pScore);  
    document.getElementById('highScoresList').append(div);  
  })
}

