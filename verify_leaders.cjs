
const fs = require('fs');

try {
    const db_raw = fs.readFileSync('c:/Users/andre/.gemini/antigravity/brain/c66d302d-2351-4b32-9708-57fcb089155a/.system_generated/steps/2163/output.txt', 'utf8');
    const db_json_text = JSON.parse(db_raw).result.match(/<untrusted-data-[^>]+>\n([\s\S]+?)\n<\/untrusted-data-/)[1];
    const db_data = JSON.parse(db_json_text);
    
    const leaders_list_raw = `
Luz Mila Molina
Isabel Ardila
Jennifer Lopez
Maria Eugenia Gonzalez
Cecilia Castañeda
Yasmin Escarraga
Alba Beatriz Gonzalez Osorio
Lucie Behaviour (Luz Aida)
Lyda Maria Olave
Yudy Homez
Monica Espinal
Claudia Franco
Lizeth Acevedo
Jhosselyn Daniela Lamus Rocha
Juan Alejandro Uran Rosas
Nelcy Uribe
Nubia Moreno
Rafael Vargas
Karen Mayorga
Cristian Alejandro ARROYAVE
Nazly Martinez
Nila Estupinan
Flor Del Carmen Rincon Orjuela
Sandra Acuna
Jonatan Giraldo Giraldo
Juan Antonio Diaz
Wilmar Salazar
Jhorjan Munoz
Nelson Enrique Galan Rivera
Luis Fernando Arroyave Rojas
Michelle Moreno
Olga Patricia Londono
Veronica Gonzalez
Gustavo Restrepo
Janeth Mazuera
Leidy Diana Rendon
Zulay Alexandra Alvarado
Yenevye Mayorga
Alexander Aguirre
Maria Enith Caicedo
Nestor Acevedo
Eugenia Polentino
Maria Alejandra Florez Murillo
Andrés Hoyos Gómez
`;

    const normalize = (str) => {
        if (!str) return "";
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ');
    };

    const namesDB = db_data.map(d => d.nombre);
    const namesLeaders = leaders_list_raw.split('\n').map(n => n.trim()).filter(n => n);
    const normDB = new Set(namesDB.map(normalize));
    
    // Check which leaders are already in DB as voters
    const matches = namesLeaders.filter(n => normDB.has(normalize(n)));
    const missing = namesLeaders.filter(n => !normDB.has(normalize(n)));
    
    console.log(JSON.stringify({
        matches,
        countMatches: matches.length,
        missing,
        countMissing: missing.length,
        totalLeaders: namesLeaders.length
    }, null, 2));

} catch (e) {
    console.error(e);
}
