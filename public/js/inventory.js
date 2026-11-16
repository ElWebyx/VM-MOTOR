/*
 * Inventario de VM MOTOR
 * ------------------------------------------------------------
 * Fuente: escaparate de VM MOTOR en coches.net (consultado el 15/11/2026).
 * Fotos: las del propio anuncio (tomadas en la exposición de VM MOTOR).
 * Para actualizar el stock basta con editar este array.
 *   photos → IDs del CDN de coches.net ("xx/uuid") o URLs completas de imagen.
 *            También vale una ruta propia, p. ej. "img/kamiq-1.jpg".
 */
const DEALER_URL = "https://www.coches.net/concesionario/vmmotor/";

const INVENTORY = [
 {
  "brand": "Audi",
  "model": "Q5 2.0 TFSI quattro",
  "year": 2010,
  "km": 108000,
  "fuel": "Gasolina",
  "hp": 211,
  "price": 15900,
  "photos": [
   "5d/5d737400-05d3-4b79-8095-b378ce043b13",
   "a2/a26718c6-4778-4e9e-bb80-2094ef1c32e0",
   "8e/8ef0273f-548b-4018-a410-977cc7b582ff",
   "49/49958161-41d3-44c5-9d25-4a17e8b8e99b",
   "f5/f55ed316-d442-4397-a75b-0c6e1f98d71e",
   "91/91fec583-0f6e-48e0-94cb-6b811fc348de",
   "06/06200390-6c66-4b10-af4d-e25364b69a9d",
   "b6/b660f9ed-73e0-4391-9f01-62b0d3dd8e70"
  ],
  "url": "https://www.coches.net/audi-q5-20-tfsi-211cv-quattro-5p-gasolina-2010-en-las-palmas-71949606-covo.aspx"
 },
 {
  "brand": "Skoda",
  "model": "Kamiq 1.0 TSI Active",
  "year": 2022,
  "km": 58000,
  "fuel": "Gasolina",
  "hp": 95,
  "price": 15490,
  "photos": [
   "c0/c058be1f-7c2a-4809-badf-c3acbf392c6e",
   "8d/8d097cae-7f53-4fef-80c4-80c3ca0dc432",
   "1c/1c69e56e-7898-47af-8a46-7d6e691b76d9",
   "9b/9b0ae006-4353-4c0a-b742-71bb30424016",
   "85/85226473-fa6e-4e4d-a625-3edfaceb30ff",
   "a4/a4b5ad37-0ca2-4869-a286-28710288ab62",
   "51/514e4ace-0003-4e17-b427-82cba71f66b2",
   "f0/f0eed39c-528d-4298-be89-7caab447c40f",
   "63/638c7097-b71e-4d93-831d-adc70386055a"
  ],
  "url": "https://www.coches.net/skoda-kamiq-10-tsi-70kw-95cv-active-5p-gasolina-2022-en-las-palmas-71967773-covo.aspx"
 },
 {
  "brand": "BMW",
  "model": "Serie 3 320i Auto",
  "year": 2011,
  "km": 101000,
  "fuel": "Gasolina",
  "hp": 170,
  "price": 14600,
  "photos": [
   "https://a.ccdn.es/cnet/vehicles/20950562/1e2bb6d9-8303-4f52-9a23-ab149e5fbd93.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/29241184-c626-4b9f-ad23-f9c4ecb97f6f.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/ee3960d7-91e2-4055-b7d5-a364ed5e9dea.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/716f2818-15d9-4539-8034-8b5dcaab916f.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/a6bf3ac0-498d-4892-9985-2b6d48df4b8d.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/7e221329-392a-4b11-8184-a70574478378.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/745fb4d9-e8a3-4750-8199-8566518a3217.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/cc58b95b-2538-418f-8b19-f8463021f1f8.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/26163bac-c7d5-4a59-b89c-f1984894e244.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/12e10aca-ee4c-4cf7-8658-f9fdb96a4d89.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/f9ea6c5d-05d1-48b5-81f6-cb26c956fa49.jpg",
   "https://a.ccdn.es/cnet/vehicles/20950562/11232cc5-adfa-4c21-ad51-147edff982cf.jpg"
  ],
  "url": "https://www.coches.net/bmw-serie-3-320i-auto-2p-gasolina-2011-en-las-palmas-71731801-covo.aspx"
 },
 {
  "brand": "Renault",
  "model": "Grand Scénic Intens Energy TCe",
  "year": 2018,
  "km": 129000,
  "fuel": "Gasolina",
  "hp": 140,
  "price": 13900,
  "photos": [
   "8b/8b5e9b00-0ee3-42f1-add5-6011e2c0c44d",
   "a2/a2072d75-6067-4834-ab3b-b6bd7f77ef7d",
   "75/752cf3da-4871-4f05-a242-d829b203af94",
   "0c/0c492572-57f9-4fe0-912d-c41299ec39d7",
   "69/693f324d-72d7-46ce-9e34-67969fc92cb7",
   "8c/8c0d1338-3af0-4e8a-a243-d2261d103a50",
   "7b/7b7c62ec-9658-4a6a-bef0-dc3b4e7e1346",
   "ec/ecc2bc9e-fa08-40d7-80fd-fadae3353fc5"
  ],
  "url": "https://www.coches.net/renault-grand-scenic-intens-energy-tce-103kw-140cv-5p-gasolina-2017-en-las-palmas-71950393-covo.aspx"
 },
 {
  "brand": "Hyundai",
  "model": "i40 1.7 CRDi Tecno Xenon Auto",
  "year": 2015,
  "km": 144000,
  "fuel": "Diésel",
  "hp": 136,
  "price": 12600,
  "photos": [
   "5b/5b832337-de21-441d-8ac8-6f5b4c440e12",
   "d4/d461df92-48e3-4f6a-bbaf-1c3ae43f0119",
   "ca/cabb83af-5549-4638-99b8-3c92e424f71d",
   "3d/3d1cd085-9a0a-4b99-907a-e2631b7ba9e5",
   "ac/ac418536-a949-44df-95d2-4d860a3af2cc",
   "96/962e58b1-56ea-4f5f-9766-7f965b20a4a1",
   "92/92fb552b-927b-4335-844c-4731197bb2da",
   "2b/2bdb7f4c-5d67-4dee-80bc-41ebfea90f64"
  ],
  "url": "https://www.coches.net/hyundai-i40-17-crdi-136cv-tecno-xenon-auto-4p-diesel-2014-en-las-palmas-71950214-covo.aspx"
 },
 {
  "brand": "Mercedes-Benz",
  "model": "Clase B B 180 CDI",
  "year": 2012,
  "km": 183000,
  "fuel": "Diésel",
  "hp": 109,
  "price": 10900,
  "photos": [
   "61/611827a3-96ba-4070-a1b6-edbf7b61f097",
   "46/4674f132-f392-46fc-b92a-dee0b0f8a8cc",
   "01/01ec398d-5b5b-403d-99ad-326da750b0bc",
   "a6/a62ccbfa-fd53-4b57-90e4-54029debd68e",
   "ea/ea8feb0d-96b5-469a-9921-a55cac2608a3",
   "38/38184e94-a3fb-4efd-89d0-0f2bf82d785e",
   "6c/6c96144c-52ce-4cd9-a6f7-fdc6a0a96fee",
   "a3/a3c146f9-d1f2-4014-865d-163b399006ec"
  ],
  "url": "https://www.coches.net/mercedes-benz-clase-b-b-180-cdi-5p-diesel-2011-en-las-palmas-71950043-covo.aspx"
 },
 {
  "brand": "BMW",
  "model": "Serie 1 118i",
  "year": 2010,
  "km": 139000,
  "fuel": "Gasolina",
  "hp": 143,
  "price": 10800,
  "photos": [
   "46/463641a9-8f5f-4365-be59-ada72d2d6aa5",
   "48/485a7b78-f65f-476a-9203-feced2ab19ed",
   "c3/c34292b1-fa27-4b35-8b47-4e6919e76ff1",
   "f2/f26c26ec-e249-4c67-9a7a-9e2860548c0a",
   "11/114ebc76-6d82-421e-8236-771b5bee8809",
   "28/28743bca-7ead-47b6-b3a2-e0e798d7c1ee",
   "de/dec3762b-6438-4849-a50f-5765a229c319",
   "4e/4ef1cc44-8cf5-463f-a8b1-cf5277930be4"
  ],
  "url": "https://www.coches.net/bmw-serie-1-118i-2p-gasolina-2010-en-las-palmas-71950250-covo.aspx"
 },
 {
  "brand": "Opel",
  "model": "Meriva 1.4 NEL Selective",
  "year": 2017,
  "km": 62000,
  "fuel": "Gasolina",
  "hp": 120,
  "price": 8900,
  "photos": [
   "01/018311af-599f-4b3a-9980-010c7b474db2",
   "bf/bfd74337-d41b-4c3e-aa73-556a469a102e",
   "d1/d1c30b92-5b0a-4641-b989-d0a444ad80bc",
   "b4/b4f7e429-ca91-483e-9bf8-5c21a980ee63",
   "88/888fe765-503f-4153-bcde-ef8722c74818",
   "b2/b215ba05-817f-49ad-8b81-2031c31a1adf",
   "21/21fe9fc4-933f-4365-84d5-08ca91c16c37",
   "b8/b832bf6a-99eb-4f34-9e3a-59d77da2be77"
  ],
  "url": "https://www.coches.net/opel-meriva-14-nel-selective-5p-gasolina-2017-en-las-palmas-71949758-covo.aspx"
 },
 {
  "brand": "Land Rover",
  "model": "Freelander 2.2 Td4 E",
  "year": 2009,
  "km": 203000,
  "fuel": "Diésel",
  "hp": 160,
  "price": 8500,
  "photos": [
   "74/746e9b13-2dd0-40fa-9d06-0b84ef619a8a",
   "25/259a4c29-6af1-4b76-bb9a-1dd77625b7ed",
   "f0/f08cee76-8311-4eff-970e-afb3bf66caef",
   "23/23c62483-a6f8-48df-9b23-f38eeb978b31",
   "12/12438e77-f658-4a3c-8ea5-001135d8a960",
   "1c/1ce5e2bf-487e-4d68-a69b-2cd3109fe631"
  ],
  "url": "https://www.coches.net/land-rover-freelander-22-td4-e-5p-diesel-2009-en-las-palmas-71950125-covo.aspx"
 },
 {
  "brand": "Fiat",
  "model": "500 0.9 Turbo TwinAir AUTO S",
  "year": 2017,
  "km": 108000,
  "fuel": "Gasolina",
  "hp": 85,
  "price": 8490,
  "photos": [
   "https://a.ccdn.es/cnet/vehicles/21065465/9bf84ef1-993c-4916-9356-c354dc85028b.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/25a620bd-f7a0-4b5b-9e02-571cdb940f05.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/3b1709a5-a0cd-4e26-a466-90a3fdc6b690.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/31cfb546-2792-47ef-a8a8-538b65392640.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/1a901bb6-41df-4ce5-9385-6f56073d7327.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/05dd6bfd-8e19-4309-9322-dabe6c56341f.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/08b5cc38-7060-42d0-8e48-ba7249aa5b74.jpg",
   "https://a.ccdn.es/cnet/vehicles/21065465/cf430bcb-5989-4429-a50c-477eb594015f.jpg"
  ],
  "url": "https://www.coches.net/fiat-500-09-turbo-twinair-63kw-85cv-auto-s-3p-gasolina-2017-en-las-palmas-71869506-covo.aspx"
 },
 {
  "brand": "Mercedes-Benz",
  "model": "Clase A A 160 Avantgarde",
  "year": 2010,
  "km": 185000,
  "fuel": "Gasolina",
  "hp": 95,
  "price": 7800,
  "photos": [
   "bc/bc723441-9218-4dc9-9227-53144aeee234",
   "97/97b0bdbe-9f15-48d2-a7bc-8e56a49743d6",
   "ab/abef4d16-5bd9-4c87-9291-3ec96836a8c5",
   "bb/bb23e371-a5a4-48bf-b1c7-c8c6931278eb",
   "b6/b6a3e6e6-a84a-4ede-b09b-df0111002fc6",
   "e0/e0afd3ef-6276-41c6-a304-b89006e1807c"
  ],
  "url": "https://www.coches.net/mercedes-benz-clase-a-a-160-avantgarde-5p-gasolina-2009-en-las-palmas-71949956-covo.aspx"
 },
 {
  "brand": "Seat",
  "model": "León 1.2 TSI StSp Reference",
  "year": 2015,
  "km": 152000,
  "fuel": "Gasolina",
  "hp": 110,
  "price": 6900,
  "photos": [
   "https://a.ccdn.es/cnet/vehicles/21038786/c50753fd-2d0e-48db-8f7a-1b509a641620.jpg",
   "https://a.ccdn.es/cnet/vehicles/21038786/89d2d50c-4f06-4b19-ae31-44f373203d93.jpg",
   "https://a.ccdn.es/cnet/vehicles/21038786/60a1bafa-600d-40a3-92ff-839605822067.jpg",
   "https://a.ccdn.es/cnet/vehicles/21038786/a5be4648-da0b-4c21-9ae0-02d55ce375d6.jpg",
   "https://a.ccdn.es/cnet/vehicles/21038786/1da46c78-336e-4aa1-b2e9-5564e488fcb5.jpg",
   "https://a.ccdn.es/cnet/vehicles/21038786/80e362a3-8fa4-414d-aa48-0a7c6582965c.jpg",
   "https://a.ccdn.es/cnet/vehicles/21038786/9c8cc500-0f0b-46fe-b2c3-c12d3cfbf1b4.jpg"
  ],
  "url": "https://www.coches.net/seat-leon-12-tsi-110cv-stsp-reference-3p-gasolina-2016-en-las-palmas-71844107-covo.aspx"
 },
 {
  "brand": "Mercedes-Benz",
  "model": "Clase C C 180 K CLASSIC",
  "year": 2003,
  "km": 179000,
  "fuel": "Gasolina",
  "hp": 143,
  "price": 5800,
  "photos": [
   "85/8585fc88-5cf6-47a4-9afe-fd56543c6813",
   "44/443fd2ed-6204-4490-8246-3505a4b6f1c9",
   "03/036abbf1-247f-4cf8-af4e-cfcc390aa599",
   "b2/b22df066-e25d-4660-bcc8-99cb8d9cc0e8",
   "ce/ce2b977d-b46c-434a-9c63-4ce5623dd394",
   "dc/dc021d1b-768f-4e24-8344-3740a6b8a4b2",
   "01/018f09e7-f21e-4d99-bbd5-61a54ea3bf96",
   "05/05d1fa25-cb33-4b91-a5e6-a9ad9015774b"
  ],
  "url": "https://www.coches.net/mercedes-benz-clase-c-c-180-k-classic-4p-gasolina-2003-en-las-palmas-71949884-covo.aspx"
 },
 {
  "brand": "Peugeot",
  "model": "207 CC 1.6 VTi 16v 120",
  "year": 2008,
  "km": 154800,
  "fuel": "Gasolina",
  "hp": 120,
  "price": 5300,
  "photos": [
   "7b/7b66459d-f26d-4831-b5e8-ee06ebc604cd",
   "d9/d9692eb5-2409-48e4-8288-659bf65bde01",
   "ad/ad7f8af3-de39-422c-83ff-5005cf3a0916",
   "38/3820f9ff-52c6-4f37-9607-5c49b116bfd6",
   "5a/5a6b8720-a0e0-4b4c-8b2d-d0b390e91636",
   "85/8555049b-8d66-4a4f-b994-d11650b6c8fa",
   "55/55c855fb-334d-4a9d-aca0-d367d33c586c",
   "61/61b83d17-98b5-47d8-8978-2ba7b1384895"
  ],
  "url": "https://www.coches.net/peugeot-207-cc-16-vti-16v-120-2p-gasolina-2008-en-las-palmas-71949445-covo.aspx"
 }
];
