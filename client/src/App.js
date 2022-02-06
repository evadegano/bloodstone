import { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { loggedIn } from './auth/auth-service';
import { getTransactions, getBlocks, getWallets } from './blockchain/blockchain-service';
import Homepage from './homepage/Homepage';
import Auth from './auth/Auth';
import UserSpace from './UserSpace';
import Legal from "./legal/Legal";
import './styles/App.css';
import "./mystyles.css";


class App extends Component {
  state = {
    loggedInUser: null,
    wallets: [],
    transactions: [],
    blocks: []
  }

  updateLoggedInUser = (userObj) => {
    this.setState({
      loggedInUser: userObj
    })
  }

  fetchUser() {
    if (this.state.loggedInUser === null) {
      loggedIn()
        .then(response => {
          this.setState({
            loggedInUser: response
          })
        })
        .catch((err) => {
          this.setState({
            loggedInUser: false
          })
        })
    }
  }

  fetchWallets() {
    getWallets()
      .then(response => {
        this.setState({
          wallets: response
        })
      })
      .catch(() => console.log("Something went wrong when retrieving wallets."))
  }

  fetchBlocks() {
    getBlocks()
      .then(response => {
        this.setState({
          blocks: response
        })
      })
      .catch(() => console.log("Something went wrong when retrieving blocks."))
  }

  fetchTransactions() {
    getTransactions()
      .then(response => {
        this.setState({
          transactions: response
        })
      })
      .catch(() => console.log("Something went wrong when retrieving transactions."))
  }

  componentDidMount() {
    this.fetchUser();
    this.fetchWallets();
    this.fetchBlocks();
    this.fetchTransactions();
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/auth" render={() => <Auth updateUser={this.updateLoggedInUser} />} />
          <Route path="/user" component={UserSpace} />
          <Route path="/legal" component={Legal} />
        </Switch>
      </div>
  );}
}


export default App;
