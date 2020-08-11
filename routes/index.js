var express = require("express");
var router = express.Router();
// var PROBLEMS = require("./problems.json");
var cors = require("cors");
var Problem = require("../models/Problem");
var vm = require("vm");
//RESTful

router.options("/problems/:problem_id",cors());

router.post("/problems/:problem_id",cors(),async function (req, res, next) {
  //  console.log(req.params.problem_id);
  /*
  
    1.클라이언트가 전달해준 사용자의 문제풀이 내용-> 실행
    2.실행한결과 ===DB에 저장되어있는 해당 문제의 정답과 일치하는지 비교
    3.비교 결과를 클라이언트에 정답
  */
  const body = req.body;
  const code = body.code;//사용자가 풀이한 내용을 셋팅
 console.log(code);
  //Client :function solution(n){return x*3;}
  //problem.tests[index].code -> "solution(3)"


    const problem = await Problem.findById(req.params.problem_id);

    let isCorrect = true;

    for (let i = 0; i < problem.tests.length; i++) {
      try{
        const script = new vm.Script(code + problem.tests[i].code);
        const result = script.runInNewContext();

      if (`${result}` !== problem.tests[i].solution) {
        isCorrect = false;
      }
    }catch(err){
      res.json({
        result:"에러",
        detail: err.message
      });

      return;
    //Status Code:200 Success
  }
  }
  if (!isCorrect) {
    res.json({ result: "오답" });
  } else {
    res.json({ result: "정답" });
  }
});


/* GET home page. */
router.get("/problems", cors(), async function (req, res, next) {
  try {
    const docs = await Problem.find();
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
