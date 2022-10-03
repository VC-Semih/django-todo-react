describe('example to-do app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('displays two incomplete todo items by default', () => {
        cy.get('.nav > :nth-child(2)').click(); //Click on incomplete
        cy.get('.list-group li').should('have.length', 2) //Check if there is 2 elements

        cy.get('.list-group li:first-child span:first-child').first().should('have.text', 'Unsee matrix 4') //Check content
        cy.get('.list-group li:last-child span:first-child').last().should('have.text', 'Acheter un cadeau pour ma blonde')
    })

    it('displays two complete todo items by default', () => {
        cy.get('.nav > :nth-child(1)').click();
        cy.get('.list-group li').should('have.length', 2)

        cy.get('.list-group li:first-child span:first-child').should('have.text', 'Visiter Montréal')
        cy.get('.list-group li:last-child span:first-child').should('have.text', 'Aller au biodôme')
    })

    it('can add new incomplete todo item then delete incomplete item', () => {
        // We'll store our item text in a variable, so we can reuse it
        const newItem = {
            title: 'Feed the cat',
            description: 'Feed Enzo with premium food',
            completed: false
        }

        const dataToAdd = {
            title: " and the dog",
            description: " and give water"
        }

        addTodo(newItem);

        //Check if our new item has been added
        cy.get('.nav > :nth-child(2)').click();
        cy.get('.list-group li')
            .should('have.length', 3)
            .last().children().first()
            .should('have.text', newItem.title);

        modifyTodo(newItem, dataToAdd);

        cy.get(':nth-child(3) > :nth-child(2) > .btn-danger').click(); //Delete the new item
        cy.get('.list-group li').should('have.length', 2) //Check if the item has been deleted
    })

    it('can add new incomplete todo item then delete complete item', () => {
        // We'll store our item text in a variable, so we can reuse it
        const newItem = {
            title: 'Feed the dog',
            description: 'Feed Fardoch with casual food',
            completed: true
        }

        const dataToAdd = {
            title: " and the cat",
            description: " and give water"
        }

        addTodo(newItem);

        //Check if our new item has been added
        cy.get('.nav > :nth-child(1)').click();
        cy.get('.list-group li')
            .should('have.length', 3)
            .last().children().first()
            .should('have.text', newItem.title);

        modifyTodo(newItem, dataToAdd);

        cy.get(':nth-child(3) > :nth-child(2) > .btn-danger').click(); //Delete the new item
        cy.get('.list-group li').should('have.length', 2) //Check if the item has been deleted
    })
})

function addTodo(item){
    cy.get('.mb-4 > .btn').click();

    cy.get('#todo-title').type(`${item.title}`);
    cy.get('#todo-description').type(`${item.description}`);
    if (item.completed) cy.get('.form-check-input').click();
    cy.get('.modal-footer > .btn').click();
}

function modifyTodo(item, modification){
    cy.get(":nth-child(3) > :nth-child(2) > .btn-secondary").click();
    cy.get('#todo-title').should('have.value', item.title).type(modification.title);
    cy.get('#todo-description').should('have.value', item.description).type(modification.description);
    if(item.completed) cy.get('.form-check-input').should('be.checked');
    else cy.get('.form-check-input').should('not.be.checked');
    cy.get('.modal-footer > .btn').click();

    cy.get('.list-group li')
        .should('have.length', 3)
        .last().children().first()
        .should('have.text', item.title + modification.title);
}