import React from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import * as Layout from './Layout'

import { LAMPORTS_PER_SOL,Account, PublicKey, Connection, SystemProgram ,Transaction,sendAndConfirmTransaction} from '@solana/web3.js';
import { Button,Grid } from '@material-ui/core';
import { HelloWorld } from './HelloWorld';



class Content extends React.Component {

  constructor(props) {
    super(props)
    this.state = { };
    this.onErase = this.onErase.bind(this);
    this.onHello = this.onHello.bind(this);
    this.onQuery = this.onQuery.bind(this);

    //let url =  'http://api.mainnet-beta.solana.com';
    //let url =  'https://solana-api.projectserum.com';
    let url =  'http://119.28.234.214:8899';
    //let url =  'https://devnet.solana.com';
    this.connection = new Connection(url);
    this.programID = new PublicKey("ASFNG77geRx6zVR3i7z7UU3oS7r1kQ4QuAW2ppYyYaiC");
    this.messageAccount = new Account();
    this.playerPrivKey = [136,110,52,25,177,59,33,252,208,157,67,200,66,34,83,248,94,110,161,40,156,235,104,28,73,233,3,255,109,59,85,164,240,29,177,212,46,230,9,255,12,214,10,209,78,79,174,119,160,91,178,114,42,99,0,177,50,110,54,221,212,219,204,115];
    this.playerAccount = new Account(this.playerPrivKey);
  }


  render() {
    return (
      <Container>


        <React.Fragment>
          <Button onClick={this.onHello}> hello</Button>
        </React.Fragment>
        <Divider />
        <React.Fragment>
          <Button onClick={this.onErase}> erase</Button>
        </React.Fragment>
        <Divider />
        <React.Fragment>
          <Button onClick={this.onQuery}> query</Button>
        </React.Fragment>
      </Container>
    );
  }

  async onQuery() {

  }

  async onErase() {
    let trxi = HelloWorld.createEraseInstruction(
      this.playerAccount.publicKey,
      this.messageAccount.publicKey,
      this.programID,
    );

    const transaction = new Transaction();
    transaction.add(trxi);

    let signers= [this.playerAccount, this.messageAccount];
    sendAndConfirmTransaction(this.connection, transaction, signers, {
        skipPreflight: false,
        commitment: 'recent',
        preflightCommitment: 'recent',
    }).then(()=>{
      console.log("done erase");
    }).catch((e)=>{
      console.log("error:", e);
    })
  }

  async onHello() {

    let messageNeeded = await this.connection.getMinimumBalanceForRentExemption(Layout.messagSpace);

    const trxi0 =  SystemProgram.createAccount({
      fromPubkey: this.playerAccount.publicKey,
      newAccountPubkey: this.messageAccount.publicKey,
      lamports: messageNeeded,
      space: Layout.messagSpace,
      programId: this.programID,
    });

    console.log("message:", this.messageAccount.publicKey.toBase58());


    let trxi = HelloWorld.createHelloInstruction(
      this.playerAccount.publicKey,
      this.messageAccount.publicKey,
      this.programID,
      "hello world!",
    );

    const transaction = new Transaction();
    transaction.add(trxi0);
    transaction.add(trxi);

    let signers= [this.playerAccount, this.messageAccount];
    sendAndConfirmTransaction(this.connection, transaction, signers, {
        skipPreflight: false,
        commitment: 'recent',
        preflightCommitment: 'recent',
    }).then(()=>{
      console.log("done hello");
    }).catch((e)=>{
      console.log("error:", e);
    })

  }
}


function App() {
  return (
    <Content />
  );
}

export default App;