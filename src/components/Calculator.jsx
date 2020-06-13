import * as React from "react";
import styled from "styled-components";

import Panel from "./Panel";
import Display from "./Display";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import History from "./History";


const Container = styled.div`
  margin: 30px auto;
  text-align: center;
`;

// TODO: History 내에서 수식 표시할 때 사용
const Box = styled.div`
  display: inline-block;
  width: 270px;
  height: 65px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  text-align: right;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  h3 {
    margin: 0px;
  }
`;

const evalFunc = function(string) {
  // eslint-disable-next-line no-new-func
  return new Function("return (" + string + ")")();
};

class Calculator extends React.Component {
  // TODO: history 추가
  state = {
    displayValue: "",
    expression: [],
    result: [],
    temp_result: ""
  };

  onClickButton = key => {
    let { displayValue = "" } = this.state;
    let { temp_result = "" } = this.state;
    let { expression = [] } = this.state;
    let { result = [] } = this.state;
    displayValue = "" + displayValue;
    const lastChar = displayValue.substr(displayValue.length - 1);
    const operatorKeys = ["÷", "×", "-", "+"];
    const proc = {
      AC: () => {
        this.setState({ displayValue: "" });
      },
      BS: () => {
        if (displayValue.length > 0) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        this.setState({ displayValue });
      },
      // TODO: 제곱근 구현
      "√": () => {
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
          //히스토리
          expression.unshift("√(" + displayValue + ")");

          let tempValue = displayValue.replace(/×/g,'*')
          tempValue = tempValue.replace(/÷/g,'/')

          if(displayValue.charAt(0)=="√") displayValue = temp_result;
          else displayValue = evalFunc(tempValue);

          displayValue = Math.sqrt(displayValue);
          //히스토리
          result.unshift("" + displayValue);
        }
        this.setState({ displayValue });
        this.setState({ expression });
        this.setState({ result });
      },
      // TODO: 사칙연산 구현
      "÷": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "÷" });
        }
      },
      "×": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "×" });
        }
      },
      "-": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "-" });
        }
      },
      "+": () => {
        // + 연산 참고하여 연산 구현
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "+" });
        }
      },
      "=": () => {
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
          //히스토리
          expression.unshift(displayValue);

          let tempValue = displayValue.replace(/×/g,'*');
          tempValue = tempValue.replace(/÷/g,'/');
          if(displayValue.charAt(0)=="√") displayValue = temp_result;
          else displayValue = evalFunc(tempValue);
          //히스토리
          result.unshift(displayValue);
        }
        this.setState({ displayValue });
        this.setState({ expression });
        this.setState({ result });
      },
      ".": () => {
        // if (Number(displayValue) == 0) displayValue += "0.";  
        // //else if ()
        // else displayValue += ".";
        // 가장 근처에 있는 연산자 탐색
        let last_op_arr = []
        last_op_arr.push(displayValue.lastIndexOf("+"));
        last_op_arr.push(displayValue.lastIndexOf("-"));
        last_op_arr.push(displayValue.lastIndexOf("×"));
        last_op_arr.push(displayValue.lastIndexOf("÷"));
        let a = Math.max.apply(null, last_op_arr);

        if (a == -1) a = 0;
        if (!(displayValue.substring(a, displayValue.length)).includes(".")) {
          if(operatorKeys.includes(displayValue.substr(displayValue.length - 1)) || Number(displayValue) == 0) 
            this.setState({ displayValue: displayValue + "0." });
          else this.setState({ displayValue: displayValue + "." });
        }

        // this.setState({ displayValue });
      },
      "0": () => {
        if (Number(displayValue) !== 0) {
          displayValue += "0";
          this.setState({ displayValue });
        }
      }
    };

    if (proc[key]) {
      proc[key]();
    } else {
      // 여긴 숫자
      this.setState({ displayValue: displayValue + key });
    }
  };

  render() {
    return (
      <Container>
        <Panel>
          <Display displayValue={this.state.displayValue} />
          <ButtonGroup onClickButton={this.onClickButton}>
            <Button size={1} color="gray">
              AC
            </Button>
            <Button size={1} color="gray">
              BS
            </Button>
            <Button size={1} color="gray">
              √
            </Button>
            <Button size={1} color="gray">
              ÷
            </Button>

            <Button size={1}>7</Button>
            <Button size={1}>8</Button>
            <Button size={1}>9</Button>
            <Button size={1} color="gray">
              ×
            </Button>

            <Button size={1}>4</Button>
            <Button size={1}>5</Button>
            <Button size={1}>6</Button>
            <Button size={1} color="gray">
              -
            </Button>

            <Button size={1}>1</Button>
            <Button size={1}>2</Button>
            <Button size={1}>3</Button>
            <Button size={1} color="gray">
              +
            </Button>

            <Button size={2}>0</Button>
            <Button size={1}>.</Button>
            <Button size={1} color="gray">
              =
            </Button>
          </ButtonGroup>
        </Panel>
        {/* TODO: History componet를 이용해 map 함수와 Box styled div를 이용해 history 표시 */}
        <History>{
          this.state.result.map((element,index) => {
            return(
              <Box onClick={() => {
                  this.setState({ displayValue : this.state.expression[index]});
                  this.setState({ temp_result : element });
                }
              }>
                <div>{this.state.expression[index]}</div>
                <div>{'= ' + element}</div>
              </Box>
            );
          }) 
        }</History>
      </Container>
    );
  }
}

export default Calculator;
