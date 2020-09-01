import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "../functions"
import * as actions from "../actions/actions";
import { exec } from "child_process";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Metrics from "./tabs/Metrics";
import Images from "./tabs/Images";
import Yml from "./tabs/Yml";
import RunningStopped from "./tabs/RunningStopped";
const App = (props) => {
  const dispatch = useDispatch();
  const addContainer = (data) => dispatch(actions.addContainer(data));
  const getRunningContainers = (data) => dispatch(actions.getRunningContainers(data))
	
	// useselector Allows you to extract data from the Redux store state, using a selector function.
	const data = useSelector((state) => state.containers.containerList);
  
  useEffect(() => {
		exec('docker ps', (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(stdout)
			return addContainer(stdout.split('\n')[1]);
		});
  }, []);

	// useEffect(() => {

  // }, [data]);
  return (
    <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Running/Stop</Link>
                </li>
                <li>
                  <Link to="/images">Images</Link>
                </li>
                <li>
                  <Link to="/metrics">Metrics</Link>
                </li>
                <li>
                  <Link to="/yml">+</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/metrics">
                <Metrics />
              </Route>
              <Route path="/yml">
                <Yml />
              </Route>            
              <Route path="/images">
                <Images />
              </Route>
              <Route path="/">
                <RunningStopped runningContainers={data}/>
                {data}
              </Route>
            </Switch>
          </div>
    </Router>
  );
};

export default App;
