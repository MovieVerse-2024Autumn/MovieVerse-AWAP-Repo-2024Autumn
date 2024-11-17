CREATE TABLE review (
    id          SERIAL PRIMARY KEY,          
    title       VARCHAR(100) NOT NULL,       
    rating      INTEGER NOT NULL,            
    description VARCHAR(255),                
    timestamp   TIMESTAMPTZ NOT NULL,        
    movie_id    INTEGER NOT NULL,            
    account_id  INTEGER NOT NULL             
);
