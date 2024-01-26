import './App.css';
import * as d3 from "d3"
import LinePlot from './Charts/test';


function App() {
  return (
    <div className="App">
      <div className='TopBar'>
        <h1>Car crash anlytics</h1>
      </div>
      <div className='ScreenCenter'>
        <div className='Filters'>

        </div>
        <div className='Map'>

        </div>
      </div>
      <div className='ScreenBottom'>
        <div className='DimReduction'>
          <LinePlot data={[12, 5, 6, 6, 9, 10]} ></LinePlot>
        </div>
        <div className='ParallelCoordinates'>

        </div>
        <div className='Heatmap'>

        </div>
      </div>
    </div>
  );
}



export default App;
