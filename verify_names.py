
import json
import unicodedata

db_data_str = '''[{"nombre":"Consuelo Carreño Anaya"},{"nombre":"Doris Yanet Molina Carreño"},{"nombre":"Gille Carolina Ocampo Galvis"},{"nombre":"José Albeiro Quintero Giraldo"},{"nombre":"Luis Angel Marin Grajales"},{"nombre":"Isabel Ardila"},{"nombre":"Geraldine Osorio Alzate"},{"nombre":"Miguel Antonio rodriguez"},{"nombre":"Clara Eugenia Saquisela Urmendiz"},{"nombre":"Jose Jairo Gomez Bravo"},{"nombre":"Jhordan Steven Betancur"},{"nombre":"Virginia Morales Varona"},{"nombre":"Andrés David Manzano Franco"},{"nombre":"Estiven Andres Ruiz Franco"},{"nombre":"Adriana Losada"},{"nombre":"Jefferson David Velasquez Uribe"},{"nombre":"Nohora Rocío Prieto Garzón"},{"nombre":"Zarich Lorena San Pedro Fernandez"},{"nombre":"Norma Juliana Galán Rivera"},{"nombre":"Gustavo Adolfo Montoya Marin"},{"nombre":"Shaily Stefanny Marroquin Garcia"},{"nombre":"Maria Lesbia Angarita Ruiz"},{"nombre":"Martha Oliva Sosa García"},{"nombre":"Gabriela Rodríguez Galán"},{"nombre":"Yenifer Osorio Ramirez"},{"nombre":"Richard Alberto Rojas Calderon"},{"nombre":"Angie Alejandra Palacio Buitrago"},{"nombre":"Carlos Andres Perez Arias"},{"nombre":"Jose Luis Buitrago Lopez"},{"nombre":"Claudia María González Rios"},{"nombre":"Patricia Morales Vera"},{"nombre":"Eudalis Yolima Fang Nieto"},{"nombre":"Jorge Andres Correa Ocampo"},{"nombre":"Cristian Eduardo Ospina Aguirre"},{"nombre":"Luz Fanny Osorio Cardona"},{"nombre":"Martha Cecilia Montoya Gómez"},{"nombre":"Martha Yolanda Calderon Yepez"},{"nombre":"Milton Preciado Suárez"},{"nombre":"Nuri Milena Riaño"},{"nombre":"Óscar Obed Ospina Garzon"},{"nombre":"Fabian Dario Morales Guzman"},{"nombre":"Juan Carlos Meneses"},{"nombre":"Marie Lucy Quintero"},{"nombre":"Marta Delsi Betancourt Fernandez"},{"nombre":"Martha Lucia Hoyos Moreno"},{"nombre":"Ana Cecilia Reyes"},{"nombre":"Bertha Jannet Catamuskay"},{"nombre":"Isnelia Acelas Jaimes"},{"nombre":"Monica Espinal"},{"nombre":"Juan Alejandro Uran Rosas"},{"nombre":"Yudy Homez"},{"nombre":"Lizeth Acevedo"},{"nombre":"Claudia Franco"},{"nombre":"Maria Alejandra Florez Murillo"},{"nombre":"Andrés Hoyos Gómez"},{"nombre":"Jennifer Lopez"},{"nombre":"Maria Eugenia Gonzalez"},{"nombre":"Yasmin Escarraga"},{"nombre":"Alba Beatriz Gonzalez Osorio"},{"nombre":"Lucie Behaviour (Luz Aida)"},{"nombre":"Lyda Maria Olave"},{"nombre":"Jhosselyn Daniela Lamus Rocha"},{"nombre":"Nelcy Uribe"},{"nombre":"Nubia Moreno"},{"nombre":"Rafael Vargas"},{"nombre":"Karen Mayorga"},{"nombre":"Veronica Gonzalez"},{"nombre":"Nelci Amanda Garzon"},{"nombre":"Yimi Alexander Escobar Guevara"},{"nombre":"Alvaro Carvajal"},{"nombre":"Andrea Juliana Londoño"},{"nombre":"Diana Marcela Areiza Saldarriaga"},{"nombre":"Juan Camilo Ríos Gómez"},{"nombre":"Juliana Marcela Aristizabal"},{"nombre":"Maria Isnelda Marin Castaño"},{"nombre":"Paula Andrea Arias"},{"nombre":"Sulay Jaramillo Gil"},{"nombre":"William Torres Zamora"},{"nombre":"Carlos Alberto Buitrago"},{"nombre":"Diego Medina"},{"nombre":"Eidy Yanery Fernández Giraldo"},{"nombre":"Leonardo Fabio Roldan Lasso"},{"nombre":"Mabel Dahian Lorenza Barreto Ramirez"},{"nombre":"Maria Ambrosia Feria Martinez"},{"nombre":"Maria Livia Avendaño Galeano"},{"nombre":"Martha Liliana Zapata Tulcan"},{"nombre":"Pablo César Orozco Hernández"},{"nombre":"Viviana Ramirez Lopez"},{"nombre":"Wilmar Salazar"},{"nombre":"Jhorjan Munoz"},{"nombre":"Nelson Enrique Galan Rivera"},{"nombre":"Luis Fernando Arroyave Rojas"},{"nombre":"Abelardo Ortiz Sandoval"},{"nombre":"Bertha Nelly González Rodriguez"},{"nombre":"Blanca Melba Patiño Álvarez"},{"nombre":"Danelly Nieva Garcia"},{"nombre":"Elizabeth Buitrago Sánchez"},{"nombre":"Luz Stella Ruiz Rojas"},{"nombre":"Ubiely Ortiz Bello"},{"nombre":"David Lucindo Galindo Escarraga"},{"nombre":"Eduy Marcelo Salinas Jimenez"},{"nombre":"Lina Maryori Velazquez Cano"},{"nombre":"Fabiola Ramírez Restrepo"},{"nombre":"Blanca Nubia Marulanda Jimenez"},{"nombre":"Claudia Maryuri Valencia Rodríguez"},{"nombre":"Ethelvina Rojas Chantre"},{"nombre":"Lizbeth Rocío Muñoz Ríos"},{"nombre":"Rafael Alberto Barrera Huertas"},{"nombre":"Diana Maria Betancur"},{"nombre":"Jeison Loaiza"},{"nombre":"Lesly Daniela Pérez Muñoz"},{"nombre":"Milton Valencia"},{"nombre":"Jakson Alberto Renteria Castro"},{"nombre":"Jhon Eduardo Tello Ruiz"},{"nombre":"Martha Andrea Mateus Tobar"},{"nombre":"William Hernandez"},{"nombre":"David Oswaldo Mesa Martinez"},{"nombre":"Diana Lizeth Vélez Tangarife"},{"nombre":"Dora Maria Tangarife Patiño"},{"nombre":"Luz Elena Martínez Mesa"},{"nombre":"Oscar Dario Mesa Martinez"},{"nombre":"Elsy del Socorro Velasquez Cano"},{"nombre":"Emilio Antonio Rivera Arias"},{"nombre":"Jamilton Gutierrez Manrique"},{"timeout":null,"nombre":"Janeth Morales Ayala"},{"nombre":"Jhon Jairo Pineda Ayala"},{"nombre":"Victor Hugo Velásquez Díaz"},{"nombre":"Juan Camilo Moncada Becerra"},{"nombre":"Leonardo Conde Romero"},{"nombre":"Maria Del Pilar Becerra Taborda"},{"nombre":"Consuelo Villegas Valenzuela"},{"nombre":"Einsenhower Ospina Castro"},{"nombre":"José Manuel Acevedo"},{"nombre":"Eduardo villamizar rincon"},{"nombre":"Faisuly Diaz"},{"nombre":"John wilmar sanchez"},{"nombre":"Libia Mercedes Diaz Quiñones"},{"nombre":"Maryury cruz castañeda"},{"nombre":"Oscar Ivan Calle Ortiz"},{"nombre":"Willy Abad Morales"},{"nombre":"Alexandra García"},{"nombre":"Angie Lorena Hoyos Valencia"},{"nombre":"José Edison Vaquero"},{"role":"Líder Principal","nombre":"Leidy Johanna Tamayo Torres"},{"nombre":"Lorena Esperanza Espitia"},{"nombre":"Lorena Mellizo"},{"nombre":"Mateo Grisales González"},{"nombre":"Matilde Margarita Isignares Leon"},{"nombre":"Reynaldo Uribe Porras"},{"nombre":"Yolanda Pinto Martinez"},{"nombre":"Alejandra Vivas"},{"nombre":"Edelmira Valencia Bustos"},{"nombre":"Patricia Castaño Pérez"},{"nombre":"Fernando Mendoza Galeano"},{"nombre":"Jorge Alben Ortiz Castaño"},{"nombre":"Ludivia Carrillo"},{"nombre":"Nancy Gaitan Sanchez"},{"nombre":"Blanca Miriam Ocampo Valencia"},{"nombre":"Luis Eduardo Urrea Bedoya"},{"nombre":"Luz Marina Holguin Mayorga"},{"nombre":"Maria Fernanda Rojas Giraldo"},{"nombre":"Maria Stella Galvis"},{"nombre":"Nancy Escobar Murillo"},{"nombre":"Aura Lorena Quiñonez Palomino"},{"nombre":"Diana Mayerli Cañon Osorio"},{"nombre":"John Alexander Manzano Rivera"},{"nombre":"Liliana Marcela Becerra Acelas"},{"nombre":"Magda Alejandra Osorio"},{"nombre":"María Camila Santa Osorio"},{"nombre":"Blanca Cenelia Cardona Hernández"},{"nombre":"Carmen Adriana Ortíz Benitez"},{"nombre":"Ligia Cardenas Gaviria"},{"nombre":"Luis Alfonso Echeverri Borrero"},{"nombre":"Luz Adriana Mendoza Álvarez"},{"nombre":"Vicky Rocío Gonzalez Hernandez"},{"nombre":"Albert Villamil"},{"nombre":"Fabián Andrés Cedeño Niño"},{"nombre":"Fernando de Jesús García Martínez"},{"nombre":"Javier londoño Murcia"},{"nombre":"Johanna Bazan"},{"nombre":"Marleny Zapata"},{"nombre":"Wilson Hernan Vargas Gomez"},{"nombre":"Yaneth Maria Ceron Quiroz"},{"nombre":"Cesar Augusto Martinez Marulanda"},{"nombre":"Fanny Maria Torres Granados"},{"nombre":"Flor Mariela Fernández Giraldo"},{"nombre":"Kelly Johanna Ocampo"},{"nombre":"Liliana Moreno Reyes"},{"nombre":"Andrés Felipe Canal Zuñiga"},{"nombre":"Mariela Herran"},{"nombre":"Carlos Martinez Riaño"},{"nombre":"Denise Bonilla"},{"nombre":"Diana del Portal Varon Medina"},{"nombre":"Flor Maria Medina"},{"nombre":"Willinton Taborda"},{"nombre":"Alexander trujillo"},{"nombre":"Maria Cristina Ovalle Gonzalez"},{"nombre":"Maria Resureccion Piñarete Merchan"},{"nombre":"Oscar Rivadeneira"},{"nombre":"Andrea Montano"},{"nombre":"José Jeovanny Posada Pelaez"},{"nombre":"Mario Arango Zapata"},{"nombre":"Nohora Janetha Saavedra Cifuentes"},{"nombre":"Roberto Romero Bedoya"},{"nombre":"Luz Alba Marroquin Garcia"},{"nombre":"Obed Ocampo Londoño"},{"nombre":"Angela Forero"},{"nombre":"Cristian David Campo Zambrano"},{"nombre":"Henry Oyola Pisco"},{"nombre":"Jhon Jairo Molina Enciso"},{"nombre":"Jose Orlando Beltran"},{"nombre":"Maria Camila Castañeda Acuña"},{"nombre":"Maria Elcy Candia Velasquez"},{"nombre":"Andrés Hernandez Londoño"},{"nombre":"Elina Esther Figueroa Alvarez"},{"nombre":"Hector Brayan Gonzalez"},{"nombre":"Héctor Sanclemente"},{"nombre":"Jhon Fabio Cespedes Quiroz"},{"nombre":"Mayerly Andrea Angulo rivera"},{"nombre":"Nayla Rivera Galán"},{"nombre":"Gladys Eugenia Pachajoa Catamuscay"},{"nombre":"Guillermo Andres Bermudez Muñoz"},{"nombre":"Henry Betancourt Pungo"},{"nombre":"Patricia Aguirre Montoya"},{"nombre":"Sandra Patricia Pérez Varón"},{"nombre":"Yeimy Stefania Rivera"},{"nombre":"Andres Camilo Villada González"},{"nombre":"Luz Fabiola Villada Serna"},{"nombre":"Noralba Alarcon Muñoz"},{"nombre":"Yolanda Zapata Duque"},{"nombre":"Alberto Antonio Toro"},{"nombre":"Alexander Ramírez Londoño"},{"nombre":"Ana Ubiely Quintero Hincapié"},{"nombre":"Aura Alicia Londoño Salazar"},{"nombre":"Cesar Augusto Vargas Arango"},{"nombre":"Elsa Ruth Arroyave Jaramillo"},{"nombre":"Gildardo de Jesús Soto Torres"},{"nombre":"Hector Elias Zapata Alvarez"},{"nombre":"Jessica Betancur Gomez"},{"nombre":"Juan Antonio Londoño Salazar"},{"nombre":"Juliana Ramírez Londoño"},{"nombre":"Ligia del Socorro Murillo Rico"},{"nombre":"Marcela Milena Linares Sosa"},{"nombre":"Maria Camila Barrera Bautista"},{"nombre":"María Esperanza Rojas Camelo"},{"nombre":"Maryori Pérez Garcia"},{"nombre":"Rosa Liliana Bazan"},{"nombre":"Sandra Lorena Martínez Londoño"},{"nombre":"Angelica M Mayorga Rojas"},{"nombre":"Hector Diaz"},{"nombre":"Sara Daniela Montoya Londoño"},{"nombre":"Sergio Giraldo Londoño"},{"nombre":"Virgelina Molina Ocampo"},{"nombre":"Elizabeth Escobar Sosa"},{"nombre":"Maria Eugenia Cardenas"},{"nombre":"Gladis Tribiño"},{"nombre":"Heidy Katherine González Rincón"},{"nombre":"Maria Olga Lopez Buitrago"},{"nombre":"Paola Marin Lopez"},{"nombre":"Carlos Enrique Ruiz Acevedo"},{"nombre":"Cenelia Osorio Ruiz"},{"nombre":"Fanny Fonseca Barrero"},{"nombre":"Nini Johanna Lopez Nieva"},{"nombre":"Jairo Ramirez Rodriguez"},{"nombre":"Jonathan Ricardo Bedoya Sanchez"},{"nombre":"Ruth Elena Taborda Alvarez"},{"nombre":"Sandra Viviana Orozco Dorado"},{"nombre":"Angie Liseth Cortazar Garcia"},{"nombre":"Blanca Eugenia Ríos Gómez"},{"nombre":"Claudia de la Candelaria Perez Tordecilla"},{"nombre":"Claudia Lorena Pelaez Puerta"},{"nombre":"Claudia Viviana Corrales Marulanda"},{"nombre":"Frank Gabriel Rendón Montoya"},{"nombre":"Hilder Deosa Mesa"},{"nombre":"Jaime andres Ospina Florez"},{"nombre":"Luz Enid Garcia Cortazar"},{"nombre":"Sindy Marcela Rendón"},{"nombre":"Yuri Andrea Buitrago"},{"nombre":"Jackeline Jaramillo"},{"nombre":"Maria Cristina Medina Leon"},{"nombre":"Paola Andrea Murillo Suarez"},{"nombre":"Rafael Ovalle"},{"nombre":"Ricardo Restrepo Henao"},{"nombre":"Diana Marcela Muñoz Reyes"},{"nombre":"Jhoana Marcela Rivera Jiménez"},{"nombre":"Luis Mario Naranjo Velázquez"},{"nombre":"Mariluz Diaz Cardenas"},{"nombre":"Yamile Mayorga Holguin"},{"nombre":"Alba Suley Aguirre García"},{"nombre":"Cenaida Ramirez Ramirez"},{"nombre":"Diana Milena Parra Gómez"},{"nombre":"FRANCISCO JAVIER FLOREZ JARAMILLO"},{"nombre":"Graciela del Socorro Tobon Noreña"},{"nombre":"Jhon Fredy Lopez"},{"nombre":"John Edinson Estrada Davila"},{"nombre":"Juan Carlos Granada Jimenez"},{"nombre":"Juliana Arias Vélez"},{"nombre":"Leidy Ximena Palacio Rodriguez"},{"nombre":"Lorenzo Agudelo Areiza"},{"nombre":"María Camila Ladino Parra"},{"nombre":"Maria Consuelo Ramirez Rios"},{"nombre":"Maria Gladis Arias Loaiza"},{"nombre":"Omir García Bustos"},{"nombre":"Rodolfo Martinez Soto"},{"nombre":"SAMANTHA AGUDELO AREIZA"},{"nombre":"Sandra Milena LLanos Valencia"},{"nombre":"William de Jesus Cardenas Cardenas"},{"nombre":"Anais Carabalí Mina"},{"nombre":"Aura Lorena Lopez Tabares"},{"nombre":"Dony Alexander Avila Lopez"},{"nombre":"Edgar David Camacho Ibarguen"},{"nombre":"John Hadder Moncada"},{"nombre":"Martha Lucía Quintero Aldana"},{"nombre":"Ana Isabel Molina Cano"},{"nombre":"Edilma Muñoz Delgado"},{"nombre":"Gloria Adriana Enciso Reyes"},{"nombre":"Isabella Rivadeneira Acosta"},{"nombre":"Jefferson José Gamarra Cerro"},{"nombre":"Luz Marina Barrantes Palacio"},{"nombre":"Manuel Santana García Hernández"},{"nombre":"María Gladys Restrepo González"},{"nombre":"Mariana Ospina Restrepo"},{"nombre":"Hernan Antonio Granada Ramirez"},{"nombre":"Mario Andrés Bermudez"},{"nombre":"Juan Diego Mesa Restrepo"},{"nombre":"Liliana María Arias Villegas"},{"nombre":"Martha Cecilia Mesa restrepo"},{"nombre":"Luz Dary López Silva"},{"nombre":"Wilson Ramírez Ramírez"},{"nombre":"Cecilia Castañeda"},{"nombre":"Nazly Martinez"},{"nombre":"Nila Estupinan"},{"nombre":"Flor Del Carmen Rincon Orjuela"},{"nombre":"Sandra Acuna"},{"nombre":"Jonatan Giraldo Giraldo"},{"nombre":"Juan Antonio Diaz"},{"nombre":"Michelle Moreno"},{"nombre":"Olga Patricia Londono"},{"nombre":"Gustavo Restrepo"},{"nombre":"Janeth Mazuera"},{"nombre":"Leidy Diana Rendon"},{"nombre":"Zulay Alexandra Alvarado"},{"nombre":"Yenevye Mayorga"},{"nombre":"Nestor Acevedo"},{"nombre":"Eduardo Alberto Ospina Osorio"},{"nombre":"Alexander Aguirre"},{"nombre":"Diego Alejandro Rizo Lopez"},{"nombre":"Juan Felipe Perez Sanchez"},{"nombre":"Cristian Alejandro ARROYAVE"},{"nombre":"Maria Enith Caicedo"},{"nombre":"Luz Mila Molina"}]'''

user_list_raw = """
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
"""

def normalize(name):
    # Remove accents, lowercase, extra spaces
    n = "".join(c for c in unicodedata.normalize('NFD', name) if unicodedata.category(c) != 'Mn')
    return " ".join(n.lower().split())

db_names = [d["nombre"] for d in json.loads(db_data_str)]
user_names = [line.strip() for line in user_list_raw.split("\n") if line.strip()]

norm_db = {normalize(n): n for n in db_names}
norm_user = {normalize(n): n for n in user_names}

matches = []
only_user = []

for nu, u in norm_user.items():
    if nu in norm_db:
        matches.append((u, norm_db[nu]))
    else:
        only_user.append(u)

only_db = [d for nd, d in norm_db.items() if nd not in norm_user]

print(json.dumps({
    "count_user": len(user_names),
    "count_db": len(db_names),
    "count_matches": len(matches),
    "missing_in_db": only_user,
    "only_in_db_extra": only_db
}, indent=2, ensure_ascii=False))
