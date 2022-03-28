import { Component } from "react";
import { Switch, Route } from "react-router-dom";
import SideNavbar from "./components/navbars/SideNavbar";
import BottomNavbar from "./components/navbars/BottomNavbar";
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import SendCoins from "./components/user/SendCoins";
import BuyCoins from "./components/user/BuyCoins";



class UserPages extends Component {
  render() {
    const userWalletName = this.props.wallets.find(wallet => wallet.address === this.props.user.activeWallet).name;

    return (
      <div className="outer-container">
        <SideNavbar user={this.props.user} />

        <Switch>
          <Route exact path="/user/:walletId" render={routerProps => 
            <Dashboard 
              {...routerProps} 
              gun={this.props.gun}
              user={this.props.user} 
              transactions={this.props.transactions}
              wallets={this.props.wallets}
              userWalletName={userWalletName}
              notifs={this.props.notifs}
              newNotifs={this.props.newNotifs}
              updateUser={this.props.updateUser}
              fetchNotifs={this.props.fetchNotifs}
              resetNotifsAlert={this.props.resetNotifsAlert} />} />
            
          <Route exact path="/user/:walletId/send-coins" render={routerProps => 
            <SendCoins {...routerProps} 
              gun={this.props.gun} 
              userWalletName={userWalletName}
              transactions={this.props.transactions}
              fetchTx={this.props.fetchTx} />} />

          <Route exact path="/user/:walletId/get-coins" render={routerProps => 
            <BuyCoins {...routerProps} 
              gun={this.props.gun} 
              userWalletName={userWalletName}
              fetchTx={this.props.fetchTx} />} />

          <Route exact path="/user/:walletId/profile" render={routerProps => 
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