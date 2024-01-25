CREATE TABLE Collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT,
    supply REAL NOT NULL,
    verified BOOLEAN NOT NULL,
    twitter TEXT,
    website TEXT,
);

CREATE TABLE CollectionAttributes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(collection_id) REFERENCES Collections(id)
);

CREATE TABLE AttributeKinds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attribute_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(attribute_id) REFERENCES CollectionAttributes(id)
);  


CREATE TABLE Items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    lastBid REAL NOT NULL,
    lastSale REAL NOT NULL,
    tokenId TEXT NOT NULL,
    FOREIGN KEY(collection_id) REFERENCES Collections(id)
);

CREATE TABLE ItemAttributes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    kind_id INTEGER NOT NULL,
    FOREIGN KEY(item_id) REFERENCES Items(id),
    FOREIGN KEY(kind_id) REFERENCES AttributeKinds(id)
);  

CREATE INDEX idx_collection_id ON CollectionAttributes(collection_id);
CREATE INDEX idx_attribute_id ON AttributeKinds(attribute_id);
CREATE INDEX idx_item_id ON ItemAttributes(item_id);
CREATE INDEX idx_kind_id ON ItemAttributes(kind_id);


CREATE TABLE Trending (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    floor REAL NOT NULL,
    market_cap REAL NOT NULL,
    volume REAL NOT NULL,
    volume_usd REAL NOT NULL,
    sales INTEGER NOT NULL,
    average REAL NOT NULL,
    kind TEXT NOT NULL,
    FOREIGN KEY(collection_id) REFERENCES Collections(id)
);

CREATE TABLE Minting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    launched DATETIME NOT NULL,
    mint_price REAL NOT NULL,
    floor REAL NOT NULL,
    mint_vol REAL NOT NULL,
    mint_vol_usd REAL NOT NULL,
    num_mints INTEGER NOT NULL,
    kind TEXT NOT NULL,
    FOREIGN KEY(collection_id) REFERENCES Collections(id)
);
