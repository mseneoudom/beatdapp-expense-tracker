$(document).ready(function(){

    //Save the expense into the Database - Input fields --> Firebase Database --> Update to add the key --> Remove previous inputs
    $('.addExpenseButton').on('click',function(){
        //Create entry in Firebase Database
        firebase.database().ref('expenses/'+$('#expenseType').children('option:selected').val()).push(
            {
                name:$('#addExpense').val(),
                type:$('#expenseType').children('option:selected').val(),
                value:$('#expenseValue').val(),
            }
            ).then((snapshot)=>{
                //adding the key to object to better manipulate
                let firebaseKey = snapshot.key
                snapshot.update({key:firebaseKey})
            }).then(()=>{
                //Delete previous entry from fields
                $('#addExpense').val('');
                $('#expenseValue').val('');
            })
    })

    //Get reference for saved objects on Firebase
    firebase.database().ref('expenses').on('value',(data)=>{
        let firebaseDB = data.val();

        $('.showExpenses').html(
            '<h2>Expense List</h2>'+
            '<div class="row">'+
                '<h3 class="listHead col-sm-3">Transaction ID</h3>'+
                '<h3 class="listHead col-sm-2">Expense</h3>'+
                '<h3 class="listHead col-sm-2">Value</h3>'+
                '<h3 class="listHead col-sm-2">Category</h3>'+

            '</div>'
            
        )
        
        //Display the expenses in the database to the webpage
        let accumExpense = 0;
        for (let key in firebaseDB){
            let expenseType = firebaseDB[key];
            for (let exp in expenseType){
                accumExpense += Number(expenseType[exp]['value'])
                $('.showExpenses').append(
                    '<div class="expenseListItem row">'+
                        '<h4 class="expenseData savedExpenseID col-md-3">'+expenseType[exp]['key']+'</h4>'+
                        '<h4 class="expenseData savedExpenseName col-md-2">'+expenseType[exp]['name']+'</h4>'+
                        '<h4 class="expenseData savedExpenseValue col-md-2">$'+expenseType[exp]['value']+'</h4>'+
                        '<h4 class="expenseData savedExpenseType col-md-2">'+expenseType[exp]['type']+'</h4>'+
                        '<button id="deleteExpenseButton" class="col-md-1" value="expenses/'+key+'/'+exp+'">Delete</button>'+
                    '</div>'
                );
            }
            $('.totalExpenses').html(
                '<h2> Total Expenses $'+accumExpense+'</h2>'
            )
        }
    })

    $('.showExpenses').on('click','#deleteExpenseButton',function(){
        firebase.database().ref($(this).val()).remove();
    })
}) 
