import { Component } from "react";
import { Switch, Route } from "react-router-dom";
import SideNavbar from "./components/navbars/SideNavbar";
import BottomNavbar from "./components/navbars/BottomNavbar";
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import SendCoins from "./components/user/SendCoins";
import BuyCoins from "./components/user/BuyCoins";


class UserPages extends Component {
  getUserWallets = () => {
    const userWallets = this.props.wallets.filter(wallet => wallet.user_id === this.props.user._id);

    return userWallets;
  }

  render() {
    const userWallets = this.getUserWallets();

    return (
      <div className="outer-container">
        <SideNavbar user={this.props.user} />

        <Switch>
          <Route exact path="/user/:walletId" render={(routerProps) => 
            <Dashboard 
            {...routerProps} 
            updateUser={this.props.updateUser} 
            user={this.props.user} 
            userWallets={userWallets} 
            transactions={this.props.transactions}
            notifs={this.props.notifs}
            fetchNotifs={this.props.fetchNotifs}
            gun={this.props.gun} />} />
            
          <Route exact path="/user/:walletId/send-coins" render={(routerProps) => 
            <SendCoins {...routerProps} 
            gun={this.props.gun} 
            fetchTx={this.props.fetchTx} />} />

          <Route exact path="/user/:walletId/get-coins" render={(routerProps) => 
            <BuyCoins {...routerProps} 
            gun={this.props.gun} 
            fetchTx={this.props.fetchTx} />} />

          <Route exact path="/user/:walletId/profile" render={(routerProps) => 
            <Profile {...routerProps} 
            user={this.props.user} 
            updateUser={this.props.updateUser} />} />
        </Switch>

        <BottomNavbar user={this.props.user} />
      </div>
    );
  }
}


export default UserPages;