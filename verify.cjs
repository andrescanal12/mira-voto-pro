
const fs = require('fs');

try {
    const db_raw = fs.readFileSync('c:/Users/andre/.gemini/antigravity/brain/c66d302d-2351-4b32-9708-57fcb089155a/.system_generated/steps/2163/output.txt', 'utf8');
    const db_json_text = JSON.parse(db_raw).result.match(/<untrusted-data-[^>]+>\n([\s\S]+?)\n<\/untrusted-data-/)[1];
    const db_data = JSON.parse(db_json_text);
    
    const user_list_raw = `
Consuelo Carreño Anaya
Doris Yanet Molina Carreño
Gille Carolina Ocampo Galvis
José Albeiro Quintero Giraldo
Luis Angel Marin Grajales
Nelci Amanda Garzon
Yimi Alexander Escobar Guevara
Alvaro Carvajal
Andrea Juliana Londoño
Diana Marcela Areiza Saldarriaga
Juan Camilo Ríos Gómez
Juliana Marcela Aristizabal
Maria Isnelda Marin Castaño
Paula Andrea Arias
Sulay Jaramillo Gil
William Torres Zamora
Carlos Alberto Buitrago
Diego Medina
Eidy Yanery Fernández Giraldo
Leonardo Fabio Roldan Lasso
Mabel Dahian Lorenza Barreto Ramirez
Maria Ambrosia Feria Martinez
Maria Livia Avendaño Galeano
Martha Liliana Zapata Tulcan
Pablo César Orozco Hernández
Viviana Ramirez Lopez
Abelardo Ortiz Sandoval
Bertha Nelly González Rodriguez
Blanca Melba Patiño Álvarez
Danelly Nieva Garcia
Elizabeth Buitrago Sánchez
Geraldine Osorio Alzate
Luz Stella Ruiz Rojas
Miguel Antonio rodriguez
Ubiely Ortiz Bello
David Lucindo Galindo Escarraga
Eduy Marcelo Salinas Jimenez
Lina Maryori Velazquez Cano
Clara Eugenia Saquisela Urmendiz
Fabiola Ramírez Restrepo
Jose Jairo Gomez Bravo
Blanca Nubia Marulanda Jimenez
Claudia Maryuri Valencia Rodríguez 
Ethelvina Rojas Chantre
Lizbeth Rocío Muñoz Ríos
Rafael Alberto Barrera Huertas
Diana Maria Betancur
Jeison Loaiza
Jhordan Steven Betancur
Lesly Daniela Pérez Muñoz
Milton Valencia
Jakson Alberto Renteria Castro
Jhon Eduardo Tello Ruiz
Martha Andrea Mateus Tobar
Virginia Morales Varona
William Hernandez
David Oswaldo Mesa Martinez
Diana Lizeth Vélez Tangarife
Diego Alejandro Rizo Lopez
Dora Maria Tangarife Patiño
Luz Elena Martínez Mesa
Oscar Dario Mesa Martinez
Victor Hugo Velásquez Díaz
Andrés David Manzano Franco
Elsy del Socorro Velasquez Cano
Emilio Antonio Rivera Arias
Estiven Andres Ruiz Franco
Jamilton Gutierrez Manrique
Janeth Morales Ayala
Jhon Jairo Pineda Ayala
John Alexander Manzano Rivera
Juan Camilo Moncada Becerra
Leonardo Conde Romero
Maria Del Pilar Becerra Taborda
Consuelo Villegas Valenzuela
Einsenhower Ospina Castro
José Manuel Acevedo
Eduardo villamizar rincon
Faisuly Diaz
John wilmar sanchez
Libia Mercedes Diaz Quiñones
Maryury cruz castañeda
Oscar Ivan Calle Ortiz
Willy Abad Morales
Alexandra García
Angie Lorena Hoyos Valencia
José Edison Vaquero
Leidy Johanna Tamayo Torres
Lorena Esperanza Espitia
Jefferson David Velasquez Uribe
Lorena Mellizo
Mateo Grisales González
Matilde Margarita Isignares Leon
Reynaldo Uribe Porras
Yolanda Pinto Martinez
Alejandra Vivas
Edelmira Valencia Bustos
Patricia Castaño Pérez
Fernando Mendoza Galeano
Jorge Alben Ortiz Castaño
Ludivia Carrillo
Nancy Gaitan Sanchez
Blanca Miriam Ocampo Valencia
Luis Eduardo Urrea Bedoya
Luz Marina Holguin Mayorga
Maria Fernanda Rojas Giraldo
Maria Stella Galvis
Nancy Escobar Murillo
Aura Lorena Quiñonez Palomino
Diana Mayerli Cañon Osorio
Liliana Marcela Becerra Acelas
Magda Alejandra Osorio
María Camila Santa Osorio
Blanca Cenelia Cardona Hernández
Carmen Adriana Ortíz Benitez
Ligia Cardenas Gaviria
Luis Alfonso Echeverri Borrero
Luz Adriana Mendoza Álvarez
Vicky Rocío Gonzalez Hernandez
Albert Villamil
Andrés Felipe Canal Zuñiga
Fabián Andrés Cedeño Niño
Fernando de Jesús García Martínez
Javier londoño Murcia
Johanna Bazan
Marleny Zapata
Norma Juliana Galán Rivera
Wilson Hernan Vargas Gomez
Yaneth Maria Ceron Quiroz
Cesar Augusto Martinez Marulanda
Fanny Maria Torres Granados
Flor Mariela Fernández Giraldo
Zarich Lorena San Pedro Fernandez
Gustavo Adolfo Montoya Marin
Kelly Johanna Ocampo
Liliana Moreno Reyes
Mariela Herran
Carlos Martinez Riaño
Denise Bonilla
Diana del Portal Varon Medina
Flor Maria Medina
Nohora Rocío Prieto Garzón
Roberto Romero Bedoya
Willinton Taborda 
Alexander trujillo
Maria Cristina Ovalle Gonzalez
Maria Resureccion Piñarete Merchan
Oscar Rivadeneira
Andrea Montano
José Jeovanny Posada Pelaez
Mario Arango Zapata
Nohora Janetha Saavedra Cifuentes
Luz Alba Marroquin Garcia
Obed Ocampo Londoño
Shaily Stefanny Marroquin Garcia
Angela Forero
Cristian David Campo Zambrano
Henry Oyola Pisco
Jhon Jairo Molina Enciso
Jose Orlando Beltran
Maria Camila Castañeda Acuña
Maria Elcy Candia Velasquez
Andrés Hernandez Londoño
Elina Esther Figueroa Alvarez
Gabriela Rodríguez Galán
Hector Brayan Gonzalez 
Héctor Sanclemente
Jhon Fabio Cespedes Quiroz
Maria Lesbia Angarita Ruiz
Martha Oliva Sosa García
Mayerly Andrea Angulo rivera
Nayla Rivera Galán
Gladys Eugenia Pachajoa Catamuscay
Guillermo Andres Bermudez Muñoz
Henry Betancourt Pungo
Patricia Aguirre Montoya
Sandra Patricia Pérez Varón
Yeimy Stefania Rivera
 Andres Camilo Villada González
Luz Fabiola Villada Serna
Noralba Alarcon Muñoz
Yolanda Zapata Duque
Alberto Antonio Toro
Alexander Ramírez Londoño
Ana Ubiely Quintero Hincapié
Angelica M Mayorga Rojas
Aura Alicia Londoño Salazar
Cesar Augusto Vargas Arango
Elsa Ruth Arroyave Jaramillo 
Gildardo de Jesús Soto Torres
Hector Diaz
Hector Elias Zapata Alvarez
Jessica Betancur Gomez
Juan Antonio Londoño Salazar
Juan Felipe Perez Sanchez
Juliana Ramírez Londoño
Ligia del Socorro Murillo Rico
Marcela Milena Linares Sosa
Maria Camila Barrera Bautista
María Esperanza Rojas Camelo
Maryori Pérez Garcia
Ricardo Restrepo Henao
Rosa Liliana Bazan
Sandra Lorena Martínez Londoño
Sara Daniela Montoya Londoño
Sergio Giraldo Londoño
Virgelina Molina Ocampo
Yenifer Osorio Ramirez
Elizabeth Escobar Sosa
Gladis Tribiño
Heidy Katherine González Rincón
Maria Olga Lopez Buitrago
Paola Marin Lopez
Carlos Enrique Ruiz Acevedo
Cenelia Osorio Ruiz
Fanny Fonseca Barrero
Nini Johanna Lopez Nieva
Jairo Ramirez Rodriguez
Jonathan Ricardo Bedoya Sanchez
Richard Alberto Rojas Calderon
Ruth Elena Taborda Alvarez
Sandra Viviana Orozco Dorado
Angie Alejandra Palacio Buitrago
Angie Liseth Cortazar Garcia
Blanca Eugenia Ríos Gómez
Carlos Andres Perez Arias
Claudia de la Candelaria Perez Tordecilla
Claudia Lorena Pelaez Puerta
Claudia Viviana Corrales Marulanda
Frank Gabriel Rendón Montoya
Hilder Deosa Mesa
Jaime andres Ospina Florez
Jose Luis Buitrago Lopez
Luz Enid Garcia Cortazar
Sindy Marcela Rendón
Yuri Andrea Buitrago
Jackeline Jaramillo
Maria Cristina Medina Leon
Paola Andrea Murillo Suarez
Rafael Ovalle
Diana Marcela Muñoz Reyes
Jhoana Marcela Rivera Jiménez
Luis Mario Naranjo Velázquez 
Mariluz Diaz Cardenas
Yamile Mayorga Holguin
Alba Suley Aguirre García 
Cristian Eduardo Ospina Aguirre
Eduardo Alberto Ospina Osorio 
Luz Fanny Osorio Cardona
Cenaida Ramirez Ramirez
Claudia María González Rios
Diana Milena Parra Gómez 
FRANCISCO JAVIER FLOREZ JARAMILLO
Graciela del Socorro Tobon Noreña
Hernan Antonio Granada Ramirez
Jhon Fredy Lopez 
John Edinson Estrada Davila
Juan Carlos Granada Jimenez
Juliana Arias Vélez 
Leidy Ximena Palacio Rodriguez
Lorenzo Agudelo Areiza
María Camila Ladino Parra
Maria Consuelo Ramirez Rios
Maria Gladis Arias Loaiza
Omir García Bustos 
Rodolfo Martinez Soto
SAMANTHA AGUDELO AREIZA
Sandra Milena LLanos Valencia
William de Jesus Cardenas Cardenas
Anais Carabalí Mina
Aura Lorena Lopez Tabares
Dony Alexander Avila Lopez
Edgar David Camacho Ibarguen
John Hadder Moncada
Martha Lucía Quintero Aldana
Patricia Morales Vera
Ana Isabel Molina Cano
Edilma Muñoz Delgado
Eudalis Yolima Fang Nieto
Gloria Adriana Enciso Reyes
Isabella Rivadeneira Acosta
Jefferson José Gamarra Cerro
Jorge Andres Correa Ocampo
Luz Marina Barrantes Palacio
Manuel Santana García Hernández
María Gladys Restrepo González
Mariana Ospina Restrepo
Mario Andrés Bermudez
Martha Cecilia Montoya Gómez
Martha Yolanda Calderon Yepez
Milton Preciado Suárez 
Nuri Milena Riaño
Óscar Obed Ospina Garzon
Fabian Dario Morales Guzman
Juan Carlos Meneses
Marie Lucy Quintero
Marta Delsi Betancourt Fernandez
Martha Lucia Hoyos Moreno
Ana Cecilia Reyes
Bertha Jannet Catamuskay
Isnelia Acelas Jaimes
Juan Diego Mesa Restrepo
Liliana María Arias Villegas
Martha Cecilia Mesa restrepo
Luz Dary López Silva
Wilson Ramírez Ramírez
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
    const namesUser = user_list_raw.split('\n').map(n => n.trim()).filter(n => n);
    const normDB = new Set(namesDB.map(normalize));
    
    const missing = namesUser.filter(n => !normDB.has(normalize(n)));
    
    console.log(JSON.stringify({
        missing,
        totalUser: namesUser.length,
        totalDB: namesDB.length,
        matches: namesUser.length - missing.length
    }, null, 2));

} catch (e) {
    console.error(e);
}
