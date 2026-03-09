
const fs = require('fs');

try {
    const db_raw = fs.readFileSync('c:/Users/andre/.gemini/antigravity/brain/c66d302d-2351-4b32-9708-57fcb089155a/.system_generated/steps/2163/output.txt', 'utf8');
    const db_json_text = JSON.parse(db_raw).result.match(/<untrusted-data-[^>]+>\n([\s\S]+?)\n<\/untrusted-data-/)[1];
    const db_data = JSON.parse(db_json_text);
    
    const normalize = (str) => {
        if (!str) return "";
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ');
    };

    const voterMap = new Map();
    db_data.forEach(v => {
        voterMap.set(normalize(v.nombre), v.id);
    });

    const dataRaw = [
        { cat: "JURADOS REMANENTES", names: ["NURY MILENA RIAÑO", "DONY ALEXANDER ÁVILA LOPEZ", "ZULAY ALEXANDRA ALVARADO NAVARRO", "SHAILY STEFANNY MARROQUIN GARCÍA", "MARCELA MILENA LINARES SOSSA", "ANDRES HERNANDEZ LONDOÑO", "DIEGO CASTAÑO FRANCO", "JAIRO HUMBERTO PINILLA AFANADOR", "HECTOR IVAN MENA ARANGO", "JUAN DIEGO ACELAS VARGAS"] },
        { cat: "APOYO ELECTORAL", names: ["LUIS ARROYAVE", "SUGGEIN"] },
        { cat: "COORDINADOR", names: ["CARLOS RIVERA"] },
        { cat: "REMANENTE", names: ["JULIANA ARIAS", "Isabel Ardila", "Maria Eugenia Gonzalez", "Edison Estrada", "Oscar Iván Calle", "Michelle Moreno", "Nazly Martinez"] },
        { cat: "JURADOS", names: ["Nila Estupiñan", "Gustavo Restrepo", "Nélson Galan", "NéstorAcevedo", "Rodolfo Martínez", "Andrés Canal", "Alexander Aguirre"] },
        { cat: "PATRICIA LONDOÑO / JOSE", names: ["PATRICIA LONDOÑO", "JOSE"] },
        { cat: "CONSOLIDACIÓN ESCRUTINIOS", names: ["CRISTIAN ARROYAVE"] },
        { cat: "TRANSPORTE - APOYO", names: ["LILY ROJAS"] },
        { cat: "TRANSPORTE - Valencia (Viernes)", names: ["Patricia Londoño"] },
        { cat: "TRANSPORTE - ALICANTE", names: ["Jairo Ramírez", "Jhon Tello", "Alex Trujillo"] },
        { cat: "TRANSPORTE - PETRER", names: ["Geovanny Posada", "Wilmar Salazar", "Yorjan Muñoz"] },
        { cat: "TRANSPORTE - VALENCIA", names: ["Roberto Romero"] },
        { cat: "TRANSPORTE - BENIDORM", names: ["Piedad Perez", "Antonio Diaz"] },
        { cat: "ALIMENTACIÓN", names: ["JOSE", "Nelcy Uribe", "Juan Mañas", "Andrés Bermudez", "Matilde Isignares"] },
        { cat: "LOGÍSTICA", names: ["LUIS ARROYAVE"] },
        { cat: "ENTREGA DE ALIMENTOS E IMPREVISTOS", names: ["DIANA Amirtidad"] },
        { cat: "PEDAGOGÍA IGLESIA", names: ["MARIA ENITH"] },
        { cat: "PEDAGOGÍA APOYO", names: ["MARIA ALEJANDRA"] },
        { cat: "PEDAGOGÍA - Alicante", names: ["Cecilia", "esposo de Cecilia", "Elina Figueroa", "Consuelo Villegas", "Esperanza Rojas", "Yudy Homez", "Alba Marroquin", "Monica Espinal"] },
        { cat: "PEDAGOGÍA - Benidorm", names: ["Yenevye Mayorga", "Karen Mayorga"] },
        { cat: "PEDAGOGÍA - Petrer", names: ["Estefania Salazar", "Nohara Saavedra"] },
        { cat: "LLEVAR A PUNTO DE VOTACIÓN", names: ["CRISTIAN"] },
        { cat: "LLEVAR A PUNTO DE VOTACIÓN - Alicante", names: ["Elvira", "Piero Solari", "Lorena", "Ivette", "Milton Valencia"] },
        { cat: "LLEVAR A PUNTO DE VOTACIÓN - Benidorm", names: ["Luz Marina Mayorga", "Yamilet Mayorga", "Ma. Eugenia Polentino", "Juan Carlos"] },
        { cat: "CALL CENTER", names: ["PATRICIA AGUIRRE"] },
        { cat: "CALL CENTER - Iglesia", names: ["Delban", "Jacobo Arroyave", "Angela Forero"] },
        { cat: "CALL CENTER - Hotel", names: ["Daniela Lamus", "Jenifer López"] }
    ];

    const inserts = [];
    dataRaw.forEach(group => {
        group.names.forEach(name => {
            const voterId = voterMap.get(normalize(name)) || null;
            inserts.push({
                nombre_manual: name,
                voter_id: voterId,
                categoria: group.cat
            });
        });
    });

    console.log(JSON.stringify(inserts));

} catch (e) {
    console.error(e);
}
