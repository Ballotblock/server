

 /**
  * allows a voter to cast a ballot that the voter has
  * @param  {org.hyperledger_composer.ballots.castVote} castBallot - the castBallot transaction
  * @transaction
  */
 function castVote(castBallot) {
   var ballot = castBallot.unmarkedBallot;
   var answers = castBallot.answers;		
  		if(ballot.marked == false)
        {
          // set marked to true and fill in the ballot options
          ballot.marked = true;
          ballot.selections = answers;
          return  getAssetRegistry('org.hyperledger_composer.ballots.Ballot').then(function(ballotRegistry){
            //update the ballot
            return ballotRegistry.update(ballot);
          })
        }
 }

/**
* allows a voter to subscribe to an election in which then a new ballot asset will be created assigned to that specific voter
* @param {org.hyperledger_composer.ballots.subElection} sub 
* @transaction
*/
function subElection(sub) {
  var voterID = sub.voter.voterId;
  var electionID = sub.election.electionId;
  var ballotID = voterID + "_" + electionID;
  
  var factory = getFactory();
  var NS = "org.hyperledger_composer.ballots";
  
  //create a new ballot
  var ballot = factory.newResource(NS, "Ballot" , ballotID);
  ballot.voter = sub.voter;
  ballot.election = sub.election;
  ballot.marked = false;
  ballot.selections = [0];
  
  return  getAssetRegistry('org.hyperledger_composer.ballots.Ballot')
    .then(
    function(ballotRegistry){
         return ballotRegistry.addAll([ballot])
     })
}


/**
* just creates some sample participants and elections quickly for testing purposes
* @param {org.hyperledger_composer.ballots.demo} demo
* @transaction
*/

function demo(demo){
  var factory = getFactory();
  var NS = "org.hyperledger_composer.ballots";
  
  // create 2 voters
  var voter1 = factory.newResource(NS, "Voter", "joe");
  var voter2 = factory.newResource(NS, "Voter", "alice");
  
  //create 1 organizer
  var organizer = factory.newResource(NS, "Organizer" , "asu");
  
  var date = new Date();
  //create 2 elections
  var election1 = factory.newResource(NS, "Election", "ASASU 2017 Election");
  election1.organizer = organizer;
  
  var proposition1 = factory.newConcept(NS, "Proposition");
  proposition1.question = "Senator for: Barret,the Honors College";
  proposition1.choices = ["Danielle Heffners" , "Emily Beaman" , "Joseph Briones" , "Keyle Storm Cloud"];
  
  var proposition2 = factory.newConcept(NS, "Proposition");
  proposition2.question = "Senator for: Ira A. Fulton Schools of Engineering";
  proposition2.choices = ["Caroline Kireopoulos" , "Eyad Al Sulaimi"];
  
  election1.propositions = [proposition1,proposition2];
  election1.startDate = date;
  election1.endDate = date;
  
  var election2 = factory.newResource(NS, "Election", "Animal Kingdom Election");
  var proposition3 = factory.newConcept(NS, "Proposition");
  var proposition4 = factory.newConcept(NS, "Proposition");
  
  proposition3.question = "Representative 1 for Jungle Council";
  proposition3.choices =["monkey","deer","cow"];
  proposition4.question = "Representative 2 for Jungle Council";
  proposition4.choices = ["buffalo", "owl" , "lynx"];
  
  election2.organizer = organizer;
  election2.propositions = [proposition3,proposition4];
  election2.startDate = date;
  election2.endDate = date;
  
  // add everything
  return getParticipantRegistry("org.hyperledger_composer.ballots.Voter")
    .then(
    function(voterRegistry){
      return voterRegistry.addAll([voter1,voter2]);
    })
  .then(
    function(){
      return getParticipantRegistry("org.hyperledger_composer.ballots.Organizer");
    })
  .then(
    function(organizerRegistry){
      return organizerRegistry.addAll([organizer]);
    })
  .then (
    function(){
    	return getAssetRegistry("org.hyperledger_composer.ballots.Election");
    })
  .then(
    function(electionRegistry){
      return electionRegistry.addAll([election1,election2]);
    })
}














