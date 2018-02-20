 /**
  * allows a voter to cast a ballot that the voter has
  * @param  {org.hyperledger_composer.ballots.vote} castBallot - the castBallot transaction
  * @transaction
  */
 function vote(castBallot) {
   var ballot = castBallot.unmarkedBallot;
   var answers = castBallot.answers;		
  		if(ballot.marked == false)
        {
          // set marked to true and fill in the ballot options
          ballot.marked = true;
          ballot.selections = answers;
          return  getAssetRegistry('org.hyperledger_composer.ballots.ballots').then(function(ballotRegistry){
            //update the ballot
            return ballotRegistry.update(ballot);
          })
        }
 }

/**
* allows a voter to subscribe to an election in which then a new ballot asset will be created assigned to that specific voter
* @param {org.hyperledger_composer.ballots.subscription} sub 
* @transaction
*/
function subscription(sub) {
  var voterID = sub.voter.voterId;
  var electionID = sub.election.electionId;
  var ballotID = voterID + "_" + electionID;
  
  var factory = getFactory();
  var NS = "org.hyperledger_composer.ballots";
  
  //create a new ballot
  var ballot = factory.newResource(NS, "ballots" , ballotID);
  ballot.voter = sub.voter;
  ballot.election = sub.election;
  ballot.marked = false;
  ballot.selections = [0];
  ballot.startDate = sub.election.startDate;
  ballot.endDate = sub.election.endDate;
  
  return  getAssetRegistry('org.hyperledger_composer.ballots.ballots')
    .then(
    function(ballotRegistry){
         return ballotRegistry.addAll([ballot])
     })
}
















