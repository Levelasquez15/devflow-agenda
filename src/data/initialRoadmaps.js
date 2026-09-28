export const INITIAL_ROADMAPS = [
  {
    id: 'go-developer',
    title: 'Go (Golang) Developer',
    subtitle: 'Ruta completa de desarrollo backend con Go (roadmap.sh/golang)',
    category: 'Backend & Sistemas',
    color: '#00ACD7',
    badgeClass: 'badge-go',
    icon: 'Terminal',
    totalWeeks: 8,
    estimatedHours: 65,
    description: 'Aprende Go desde la sintaxis básica, concurrencia nativa con Goroutines y Canales, hasta microservicios y APIs REST escalables.',
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1: Fundamentos de Go y Entorno',
        goal: 'Dominar la instalación, estructura de módulos, tipos básicos y control de flujo.',
        days: [
          {
            id: 'go-d1',
            dayName: 'Lunes',
            title: 'Sintaxis básica, Variables y Tipos Primitivos',
            estimatedMinutes: 40,
            youtubeId: 'YS4e4q9oBaU',
            youtubeTitle: 'Go (Golang) Tutorial para Principiantes - Sintaxis y Variables',
            concepts: [
              'Estructura de paquetes (package main)',
              'Declaración corta := vs var',
              'Zero values y tipos estrictos',
              'Función main() y formateo con gofmt'
            ],
            exercises: [
              { id: 'ex-1', text: 'Escribe un programa que declare 3 variables de distinto tipo e imprima su tipo con fmt.Printf("%T")', done: false },
              { id: 'ex-2', text: 'Crea una constante para el número PI y calcula el perímetro de una circunferencia', done: false }
            ],
            codeSnippet: `package main

import "fmt"

func main() {
    name := "Desarrollador Go"
    var hoursToStudy int = 2
    fmt.Printf("Meta: %s estudiará %d horas hoy.\\n", name, hoursToStudy)
}`,
            status: 'completed',
            timeSpentSeconds: 2400,
            notes: 'Go no tiene clases ni herencia tradicional, usa composición y structs. Las variables declaradas no utilizadas provocan error de compilación.'
          },
          {
            id: 'go-d2',
            dayName: 'Martes',
            title: 'Control de Flujo: If, Switch y For Loops',
            estimatedMinutes: 45,
            youtubeId: 'yyUHQIec83I',
            youtubeTitle: 'Golang: Bucles For y Condicionales Idiomáticos',
            concepts: [
              'En Go solo existe el bucle `for` (reemplaza a while y do-while)',
              'Instrucciones if con inicialización corta: `if err := do(); err != nil`',
              'Switch sin break explícito y switch con tipos'
            ],
            exercises: [
              { id: 'ex-3', text: 'Implementa el algoritmo FizzBuzz del 1 al 50 usando un bucle for y switch', done: false },
              { id: 'ex-4', text: 'Crea una función que verifique si un número es primo', done: false }
            ],
            codeSnippet: `package main

import "fmt"

func main() {
    for i := 1; i <= 15; i++ {
        switch {
        case i%15 == 0:
            fmt.Println("FizzBuzz")
        case i%3 == 0:
            fmt.Println("Fizz")
        case i%5 == 0:
            fmt.Println("Buzz")
        default:
            fmt.Println(i)
        }
    }
}`,
            status: 'in_progress',
            timeSpentSeconds: 1250,
            notes: 'La inicialización dentro del if es una de las mejores prácticas idiomáticas para capturar errores.'
          },
          {
            id: 'go-d3',
            dayName: 'Miércoles',
            title: 'Funciones, Retornos Múltiples y Defer',
            estimatedMinutes: 50,
            youtubeId: 'yyUHQIec83I',
            youtubeTitle: 'Go Functions: Múltiples Retornos y Ejecución Diferida (defer)',
            concepts: [
              'Funciones de primera clase y funciones anónimas',
              'Retorno múltiple de valores (valor, error)',
              'La palabra clave `defer` y su orden LIFO (Last In, First Out)'
            ],
            exercises: [
              { id: 'ex-5', text: 'Crea una función divide(a, b float64) (float64, error) que devuelva error si b es cero', done: false },
              { id: 'ex-6', text: 'Usa defer para medir el tiempo de ejecución de una función con time.Now()', done: false }
            ],
            codeSnippet: `package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("no es posible dividir entre cero")
    }
    return a / b, nil
}`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2: Estructuras, Punteros, Slices y Maps',
        goal: 'Comprender la gestión de memoria en Go, referencias y estructuras complejas.',
        days: [
          {
            id: 'go-w2-d1',
            dayName: 'Lunes',
            title: 'Punteros y Gestión de Memoria en Go',
            estimatedMinutes: 45,
            youtubeId: 'YS4e4q9oBaU',
            youtubeTitle: 'Pointers in Go - Memory Addressing & Pass by Reference',
            concepts: [
              'Operador & (dirección en memoria) y * (desreferenciación)',
              'Paso por valor vs paso por puntero',
              'Escape analysis: Stack vs Heap'
            ],
            exercises: [
              { id: 'ex-7', text: 'Escribe una función que incremente el saldo de una cuenta bancaria modificando el valor original por puntero', done: false }
            ],
            codeSnippet: `package main

import "fmt"

func updateScore(score *int) {
    *score += 10
}

func main() {
    current := 90
    updateScore(&current)
    fmt.Println("Nuevo puntaje:", current) // 100
}`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          },
          {
            id: 'go-w2-d2',
            dayName: 'Martes',
            title: 'Slices vs Arrays y Manejo Dinámico',
            estimatedMinutes: 50,
            youtubeId: 'yyUHQIec83I',
            youtubeTitle: 'Go Slices Under the Hood: Length, Capacity and Append',
            concepts: [
              'Diferencia entre Array fijo y Slice dinámico',
              'Capacidad (cap) y Longitud (len)',
              'Función make y operador append con realocación'
            ],
            exercises: [
              { id: 'ex-8', text: 'Crea un slice de tareas pendientes y utiliza append para agregar 5 elementos dinámicamente', done: false }
            ],
            codeSnippet: `package main

import "fmt"

func main() {
    todos := []string{"Aprender Go", "Revisar Roadmap"}
    todos = append(todos, "Construir API")
    fmt.Println(todos)
}`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      },
      {
        weekNumber: 3,
        title: 'Semana 3: Concurrencia de Alto Nivel (Goroutines & Channels)',
        goal: 'Dominar la joya de Go: CSP (Communicating Sequential Processes) y concurrencia segura.',
        days: [
          {
            id: 'go-w3-d1',
            dayName: 'Jueves',
            title: 'Goroutines y Canales (Channels) Básicos',
            estimatedMinutes: 60,
            youtubeId: 'YS4e4q9oBaU',
            youtubeTitle: 'Golang Concurrency: Goroutines, Buffered Channels & WaitGroups',
            concepts: [
              'Lanzar tareas asíncronas ligeras con `go fn()`',
              'Canales unbuffered y buffered',
              'Sincronización con sync.WaitGroup',
              'Manejo de select para multiplexar canales'
            ],
            exercises: [
              { id: 'ex-9', text: 'Crea 3 goroutines que simulen descargas de archivos y comuniquen su resultado a un canal común', done: false }
            ],
            codeSnippet: `package main

import (
    "fmt"
    "time"
)

func worker(id int, ch chan string) {
    time.Sleep(1 * time.Second)
    ch <- fmt.Sprintf("Worker %d completó su tarea", id)
}

func main() {
    ch := make(chan string, 2)
    go worker(1, ch)
    go worker(2, ch)
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Ciberseguridad & Hacking Ético',
    subtitle: 'Ruta de Seguridad Ofensiva y Defensiva (roadmap.sh/cyber-security)',
    category: 'Seguridad & Infraestructura',
    color: '#F43F5E',
    badgeClass: 'badge-sec',
    icon: 'Shield',
    totalWeeks: 8,
    estimatedHours: 75,
    description: 'Fundamentos de redes seguras, análisis de vulnerabilidades, OWASP Top 10, criptografía práctica y defensa de servidores.',
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1: Fundamentos de Redes y Modelo OSI/TCP-IP',
        goal: 'Comprender cómo viajan los paquetes, puertos, protocolos y análisis con Wireshark.',
        days: [
          {
            id: 'sec-d1',
            dayName: 'Lunes',
            title: 'Modelo OSI, TCP vs UDP y Puertos Críticos',
            estimatedMinutes: 50,
            youtubeId: '3Kq1MIfTWCE',
            youtubeTitle: 'Curso de Ciberseguridad: Redes, Protocolos y Puertos',
            concepts: [
              'Las 7 capas del modelo OSI vs TCP/IP',
              'Three-way handshake (SYN, SYN-ACK, ACK)',
              'Puertos comunes (22 SSH, 80 HTTP, 443 HTTPS, 53 DNS, 3306 MySQL)'
            ],
            exercises: [
              { id: 'ex-sec-1', text: 'Usa `netstat -ano` en terminal para listar las conexiones activas en tu equipo', done: false },
              { id: 'ex-sec-2', text: 'Explica la diferencia entre TCP y UDP y por qué DNS usa UDP en el puerto 53', done: false }
            ],
            codeSnippet: `# Ejemplo de comando PowerShell para inspeccionar puertos en escucha
Get-NetTCPConnection -State Listen | Select-Object LocalPort, OwningProcess`,
            status: 'completed',
            timeSpentSeconds: 3000,
            notes: 'Comprender el apretón de manos de 3 vías de TCP es fundamental para entender ataques SYN flood y escaneo con Nmap.'
          },
          {
            id: 'sec-d2',
            dayName: 'Miércoles',
            title: 'Escaneo de Redes y Reconocimiento con Nmap',
            estimatedMinutes: 55,
            youtubeId: '4t4kBkMsDbQ',
            youtubeTitle: 'Aprende Nmap desde Cero - Escaneo y Detección de Servicios',
            concepts: [
              'Escaneo SYN (-sS) vs Connect (-sT)',
              'Detección de versiones de servicio (-sV) y SO (-O)',
              'Uso de scripts de Nmap (NSE) para detección de fallos comunes'
            ],
            exercises: [
              { id: 'ex-sec-3', text: 'Realiza un escaneo educativo sobre scanme.nmap.org identificando puertos abiertos', done: false }
            ],
            codeSnippet: `nmap -sS -sV -p 22,80,443 scanme.nmap.org`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2: Seguridad en Aplicaciones Web & OWASP Top 10',
        goal: 'Aprender las vulnerabilidades web más críticas y cómo mitigarlas.',
        days: [
          {
            id: 'sec-w2-d1',
            dayName: 'Viernes',
            title: 'Inyecciones SQL (SQLi) y Cross-Site Scripting (XSS)',
            estimatedMinutes: 60,
            youtubeId: '3Kq1MIfTWCE',
            youtubeTitle: 'OWASP Top 10 Explicado: SQL Injection y Reflected XSS',
            concepts: [
              'Inyección SQL clásica y Blind SQLi',
              'Consultas preparadas y sanitización de entradas',
              'XSS almacenado, reflejado y DOM-based',
              'Políticas de Content-Security-Policy (CSP)'
            ],
            exercises: [
              { id: 'ex-sec-4', text: 'Completa un laboratorio de SQL Injection en PortSwigger Web Security Academy', done: false }
            ],
            codeSnippet: `// Consulta VULNERABLE:
// "SELECT * FROM users WHERE user = '" + input + "'"

// Consulta SEGURA con Prepared Statements (Go/Postgres):
db.Query("SELECT id, username FROM users WHERE email = $1", email)`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      }
    ]
  },
  {
    id: 'postgresql-master',
    title: 'PostgreSQL Database Engineer',
    subtitle: 'Ruta de Base de Datos Relacional y Rendimiento (roadmap.sh/postgresql)',
    category: 'Bases de Datos & SQL',
    color: '#336791',
    badgeClass: 'badge-pg',
    icon: 'Database',
    totalWeeks: 6,
    estimatedHours: 50,
    description: 'Modelado relacional, consultas analíticas avanzadas, JSONB, optimización con EXPLAIN ANALYZE, transacciones ACID y replicación.',
    weeks: [
      {
        weekNumber: 1,
        title: 'Semana 1: Arquitectura de Postgres, DDL & Consultas Clave',
        goal: 'Instalación, estructura de catálogos de Postgres, tipos de datos y consultas analíticas.',
        days: [
          {
            id: 'pg-d1',
            dayName: 'Martes',
            title: 'Arquitectura de Postgres y Tipos de Datos Nativos',
            estimatedMinutes: 45,
            youtubeId: 'qw--VYLpxG4',
            youtubeTitle: 'Curso PostgreSQL: Arquitectura y Primeros Pasos',
            concepts: [
              'Procesos de Postgres (postmaster, background workers)',
              'Tipos numéricos, timestamp with time zone, UUID',
              'Creación de tablas con restricciones (CHECK, UNIQUE, FOREIGN KEY)'
            ],
            exercises: [
              { id: 'ex-pg-1', text: 'Crea una tabla `courses` con una restricción CHECK que valide que `price >= 0`', done: false }
            ],
            codeSnippet: `CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    price NUMERIC(8,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);`,
            status: 'completed',
            timeSpentSeconds: 2700,
            notes: 'Siempre usar TIMESTAMPTZ en lugar de TIMESTAMP para evitar dolores de cabeza con zonas horarias.'
          },
          {
            id: 'pg-d2',
            dayName: 'Jueves',
            title: 'Consultas Avanzadas: CTEs (WITH) y Window Functions',
            estimatedMinutes: 55,
            youtubeId: 'qw--VYLpxG4',
            youtubeTitle: 'PostgreSQL Window Functions (OVER, PARTITION BY) y CTEs',
            concepts: [
              'Common Table Expressions (WITH queries)',
              'Funciones de ventana: ROW_NUMBER(), RANK(), DENSE_RANK()',
              'Agregaciones con PARTITION BY'
            ],
            exercises: [
              { id: 'ex-pg-2', text: 'Escribe una consulta que obtenga el usuario con más horas de estudio por cada categoría usando ROW_NUMBER()', done: false }
            ],
            codeSnippet: `WITH RankedStudents AS (
    SELECT 
        student_id,
        category,
        study_hours,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY study_hours DESC) as rn
    FROM student_progress
)
SELECT * FROM RankedStudents WHERE rn = 1;`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      },
      {
        weekNumber: 2,
        title: 'Semana 2: Índices, JSONB y Optimización (EXPLAIN ANALYZE)',
        goal: 'Dominar el planificador de consultas y tipos semi-estructurados.',
        days: [
          {
            id: 'pg-w2-d1',
            dayName: 'Sábado',
            title: 'Tipos JSONB e Índices GIN vs B-Tree',
            estimatedMinutes: 50,
            youtubeId: 'qw--VYLpxG4',
            youtubeTitle: 'Postgres JSONB: Rendimiento NoSQL dentro de SQL Relacional',
            concepts: [
              'JSON vs JSONB (almacenamiento binario descomprimido)',
              'Operadores JSON: ->, ->>, ?&, @>',
              'Creación de índices GIN sobre columnas JSONB'
            ],
            exercises: [
              { id: 'ex-pg-3', text: 'Crea una tabla con un campo metadata JSONB y filtra registros con el operador @>', done: false }
            ],
            codeSnippet: `CREATE INDEX idx_user_metadata_gin ON users USING GIN (metadata);
-- Búsqueda ultra rápida:
SELECT * FROM users WHERE metadata @> '{"role": "admin"}';`,
            status: 'pending',
            timeSpentSeconds: 0,
            notes: ''
          }
        ]
      }
    ]
  }
];

export const INITIAL_SCHEDULE = [
  {
    id: 'task-1',
    roadmapId: 'go-developer',
    topicId: 'go-d1',
    title: 'Sintaxis básica y Variables en Go',
    date: '2026-09-28', // Today
    dayName: 'Lunes',
    timeSlot: '09:00 - 10:00',
    durationMinutes: 40,
    status: 'completed',
    actualSecondsStudied: 2400,
    notes: 'Completado con éxito. Se comprendió la diferencia de := y var.'
  },
  {
    id: 'task-2',
    roadmapId: 'go-developer',
    topicId: 'go-d2',
    title: 'Control de Flujo: If, Switch y For en Go',
    date: '2026-09-29', // Tomorrow
    dayName: 'Martes',
    timeSlot: '10:00 - 11:00',
    durationMinutes: 45,
    status: 'in_progress',
    actualSecondsStudied: 1250,
    notes: 'Repasar inicialización corta en sentencias if.'
  },
  {
    id: 'task-3',
    roadmapId: 'postgresql-master',
    topicId: 'pg-d1',
    title: 'Arquitectura de Postgres & Tipos Nativos',
    date: '2026-09-29', // Tomorrow
    dayName: 'Martes',
    timeSlot: '16:00 - 17:00',
    durationMinutes: 45,
    status: 'pending',
    actualSecondsStudied: 0,
    notes: ''
  },
  {
    id: 'task-4',
    roadmapId: 'go-developer',
    topicId: 'go-d3',
    title: 'Funciones, Retornos Múltiples y Defer',
    date: '2026-09-30',
    dayName: 'Miércoles',
    timeSlot: '10:00 - 11:00',
    durationMinutes: 50,
    status: 'pending',
    actualSecondsStudied: 0,
    notes: ''
  },
  {
    id: 'task-5',
    roadmapId: 'cybersecurity-analyst',
    topicId: 'sec-d2',
    title: 'Escaneo y Reconocimiento con Nmap',
    date: '2026-09-30',
    dayName: 'Miércoles',
    timeSlot: '18:00 - 19:00',
    durationMinutes: 55,
    status: 'pending',
    actualSecondsStudied: 0,
    notes: ''
  },
  {
    id: 'task-6',
    roadmapId: 'postgresql-master',
    topicId: 'pg-d2',
    title: 'Consultas Avanzadas: CTEs y Window Functions',
    date: '2026-10-01',
    dayName: 'Jueves',
    timeSlot: '15:00 - 16:00',
    durationMinutes: 55,
    status: 'pending',
    actualSecondsStudied: 0,
    notes: ''
  },
  {
    id: 'task-7',
    roadmapId: 'cybersecurity-analyst',
    topicId: 'sec-w2-d1',
    title: 'Inyecciones SQL (SQLi) & OWASP Top 10',
    date: '2026-10-02',
    dayName: 'Viernes',
    timeSlot: '17:00 - 18:30',
    durationMinutes: 60,
    status: 'pending',
    actualSecondsStudied: 0,
    notes: ''
  }
];
