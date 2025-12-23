# Brasil API SDK

## Descrição
Este projeto tem como objetivo fornecer uma SDK (Software Development Kit) não oficial para facilitar a integração com a [Brasil API](https://brasilapi.com.br/), uma API pública que oferece diversos serviços relacionados ao Brasil, como informações sobre CEPs, CNPJs, feriados nacionais, entre outros.
- Não deixe de conferir a [documentação oficial da Brasil API](https://brasilapi.com.br/docs) para mais detalhes sobre os endpoints disponíveis e suas funcionalidades.

## Funcionalidades
- [Bancos](#bancos)
- [Corretoras](#corretoras)
- [Cidades](#cidades)
- [CNPJ](#cnpj)
- [Moedas](#moedas)
- [Cotações](#cotações)
- [DDD](#ddd)
- [Domínios](#domínios)
- [Fipe](#fipe)
- [Feriados](#feriados)
- [IBGE](#ibge)
- [ISBN](#isbn)
- [Clima Marítimo](#clima-marítimo)
- [NCM](#ncm)
- [Pix](#pix)
- [Taxas de juros](#taxas-de-juros)
- [Clima Atual](#clima-atual)
- [Previsão do tempo](#previsão-do-tempo)

## Configurações iniciais
- Antes de utilizar a SDK, é recomendado a revisão e se necessário a alterações das configurações básicas da api, são elas: Url base e timeout
- a configuração padrão é: 
- base url - `https://brasilapi.com.br/api`
- timeout - 5000 Milisegundos
- Ex:
```ts
(() => {
 configure({
  baseUrl: 'https://brasilapi.com.br/api',
  timeoutMs: 5000,})
})();
```

## Erros lançados
- A SDK lança erros personalizados de acordo com a resposta da Brasil API, são eles:
- AppError - Erro base para todos os outros erros
- BadRequestError - Lançado quando a API retorna um 400.
- NotFoundError - Lançado quando a API retorna um 404.
- ServerError - Lançado quando um erro desconhecido ocorre
- TimeOutError - Lançado após o timeOut de uma rota, Utilize a função [configure](#configure) para alterar o timeout padrão

## Referência
### Bancos
#### getAllBanks(): `Promise<Bank[]>`
- Retorna uma lista de todos os bancos cadastrados na Brasil API.
#### getBankByCode(string code) : `Promise<Bank>`
- Retorna informações detalhadas sobre um banco específico, identificado pelo seu código.
##### **Bank Models:**
```ts
Bank {
  ispb: string;
  name: string;
  code: number;
  fullName: string;
}
```
### Corretoras
#### getAllBrokers(): `Promise<Broker[]>`
- Retorna uma lista de todas as corretoras cadastradas na Brasil API.
#### getBrokerByCnpj(string cnpj): `Promise<Broker>`
- Retorna informações detalhadas sobre uma corretora específica, identificada pelo seu CNPJ.
##### **Broker Models:**
```ts
Broker {
  cnpj: string;
  type: string;
  socialName: string;
  comercialName: string;
  status: BrokerStatus;
  email: string;
  phone: string;
  cep: string;
  country: string;
  uf: Uf;
  city: string;
  neighborhood: string;
  complement?: string;
  address: string;
  netEquityDate: Date;
  netEquityValue: number;
  cvmCode: string;
  situationStartDate: Date;
  registrationDate: Date;
}

BrokerStatus {
  CANCELED = 'CANCELADA',
  NORMAL = 'EM FUNCIONAMENTO NORMAL',
}
```

### Cidades
#### listCities(): `Promise<City[]>`
- Retorna uma lista de todas as cidades cadastradas na Brasil API.
#### listCityByName(cityName: string): `Promise<City[]>`
- Retorna uma lista de cidades que correspondem ao nome ou fragmento do nome fornecido.
##### **City Models:**
```ts
City {
  name: string;
  id: string;
  uf: Uf;
}
```
### CNPJ
#### getCnpj(cnpj: string): `Promise<Cnpj>`
- Retorna informações detalhadas sobre uma empresa específica, identificada pelo seu CNPJ.
##### **CNPJ Models:**
```ts
Cnpj {
  uf: Uf;
  cep: string;
  qsa: Qsa[] | null;
  cnpj: string;
  country?: string;
  email?: string;
  companySize: CompanySize;
  neighborhood: string;
  number: string;
  dddFax?: string;
  city: string;
  address: string;
  cnaeTax: number;
  countryId?: number;
  complement: string;
  companySizeId: number;
  companyName: string;
  fantasyName: string;
  socialCapital: number;
  dddPhone1?: string;
  dddPhone2?: string;
  mei: boolean;
  cityId?: number;
  secondaryCnae?: Cnae[];
  legalNature: string;
  taxRegime: TaxRegime[];
  specialSituation?: string;
  simples: boolean;
  registrationStatus: number;
  meiOptionDate?: Date;
  meiExcludedDate?: Date;
  cnaeDescription?: string;
  ibgeCityId?: number;
  startDate: Date;
  specialSituationDate?: Date;
  simplesOptionDate?: Date;
  registrationStatusDate?: Date;
  exteriorCityName?: string;
  legalNatureId?: number;
  simplesExcludedDate?: Date;
  reasonForRegistrationStatus?: number;
  responsibleFederativeEntity?: string;
  branchMatrixIdentifier?: number;
  responsableQualification?: number;
  descriptionRegistrationStatus?: string;
  addressTypeDescription?: string;
  descriptionReasonRegistrationStatus?: string;
  descriptionIdentifierBranchMatrix?: string;
}

Qsa {
  country?: string;
  memberName: string;
  countryCode?: string;
  ageRange: AgeRange;
  cpf_cnpj: string;
  partnerQualification: string;
  ageRangeCode: number;
  entryDate: Date;
  partnerId: number;
  partnerQualificationId: number;

  legalRepresentativeCpf: string;
  legalRepresentativeName: string;
  legalRepresentativeQualification: string;
  legalRepresentativeQualificationId: number;
}

AgeRange {
  MINOR_0_17 = 'Entre 0 a 17 anos',
  YOUNG_ADULT_18_25 = 'Entre 18 a 25 anos',
  ADULT_26_30 = 'Entre 26 a 30 anos',
  ADULT_31_40 = 'Entre 31 a 40 anos',
  ADULT_41_50 = 'Entre 41 a 50 anos',
  ADULT_51_60 = 'Entre 51 a 60 anos',
  SENIOR_61_70 = 'Entre 61 a 70 anos',
  ELDERLY_ABOVE_70 = 'Acima de 70 anos',
}

Cnae {
  code: string;
  description: string;
}

CompanySize {
  MICRO_ENTERPRISE = 'MICRO EMPRESA',
  SMALL_ENTERPRISE = 'EMPRESA DE PEQUENO PORTE',
  MEDIUM_ENTERPRISE = 'EMPRESA DE MÉDIO PORTE',
  LARGE_ENTERPRISE = 'EMPRESA DE GRANDE PORTE',
  VERY_LARGE_ENTERPRISE = 'DEMAIS',
}

TaxRegime {
  year: number;
  scpCnpj?: string;
  taxForm?: string;
  bookkeepingNumber: number;
}
```

### Moedas
#### getAllCurrencies(): `Promise<Currency[]>`
- Retorna uma lista de todas as moedas cadastradas na Brasil API.
##### Currency Models:
```ts
Currency {
  symbol: CurrencySymbol;
  name: string;
  type: string;
}

CurrencySymbol {
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  DKK = 'DKK',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  NOK = 'NOK',
  SEK = 'SEK',
  USD = 'USD',
}
```
### Cotações
#### getExchangeByCurrencyAndDate(currency: CurrencySymbol, date: Date): `Promise<Exchange>`
- Retorna a cotação de uma moeda específica para o real em uma data fornecida.
##### Exchange Models:
```ts
Exchange {
  bulletins: Bulletin[];
  date: string;
  currency: CurrencySymbol;
}

Bulletin {
  buyParity: number;
  sellParity: number;
  buyRate: number;
  sellRate: number;
  timestamp: Date;
  type: BulletinType;
}

BulletinType {
  ABERTURA = 'ABERTURA',
  INTERMEDIÁRIO = 'INTERMEDIÁRIO',
  FECHAMENTO_INTERBANCÁRIO = 'FECHAMENTO INTERBANCÁRIO',
  FECHAMENTO_PTAX = 'FECHAMENTO PTAX',
}
```
### DDD
#### getDddInfo(ddd: number): `Promise<DddInfo>`
- Retorna informações detalhadas sobre um DDD específico.
##### DDD Models:
```ts
DddInfo {
  state: Uf;
  cities: string[];
}
```

### Domínios
#### getDomainInfo(domain: string): `Promise<DomainInfo>`
- Retorna informações detalhadas sobre um domínio específico.
- Pode receber domínios somente com o nome (exemplo: "intway.com.br") ou a URL completa sem o www ou subdomínios (exemplo: "https://intway.com.br").

##### Domain Models:
```ts
DomainInfo {
  statusCode: number;
  status: DomainStatus;
  fqdn: string;
  host?: string[];
  publicationStatus?: string;
  expiryDate?: string;
  suggestion?: string[];
  fqdnace: string;
  exempt: boolean;
  reason?: string[];
}

DomainStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  REGISTERED = 'REGISTERED',
}
```
Exemplos de retornos:
``` Json

Registrado: 
{
  statusCode: 2,
  status: 'REGISTERED',
  fqdn: 'nathanks.com.br',
  fqdnace: '',
  exempt: false,
  host: undefined,
  publicationStatus: 'published',
  expiryDate: undefined,
  suggestion: [
    'agr.br',  'api.br',  'app.br',
    'art.br',  'blog.br', 'dev.br',
    'eco.br',  'esp.br',  'etc.br',
    'far.br',  'flog.br', 'ia.br',
    'imb.br',  'ind.br',  'inf.br',
    'log.br',  'net.br',  'ong.br',
    'rec.br',  'seg.br',  'social.br',
    'srv.br',  'tec.br',  'tmp.br',
    'tur.br',  'tv.br',   'vlog.br',
    'wiki.br', 'xyz.br'
  ],
  reason: undefined
}

Disponível:
{
  statusCode: 0,
  status: 'AVAILABLE',
  fqdn: 'nathanksdfsdf.com.br',
  fqdnace: '',
  exempt: false,
  host: undefined,
  publicationStatus: undefined,
  expiryDate: undefined,
  suggestion: undefined,
  reason: undefined
}

Indisponível:
{
  statusCode: 3,
  status: 'UNAVAILABLE',
  fqdn: 'exemplo.com.br',
  fqdnace: '',
  exempt: false,
  host: undefined,
  publicationStatus: undefined,
  expiryDate: undefined,
  suggestion: undefined,
  reason: [ 'Palavra reservada pelo CG' ]
}
```

### Fipe
#### getBrandByVehicleType(vehicleType: VehicleType): `Promise<FipeBrand[]>`
- Retorna uma lista de marcas de veículos com base no tipo de veículo fornecido.
#### getBrandsVehicleModel(type: VehicleType, brand: number): `Promise<VehicleModel[]>`
- Retorna uma lista de modelos de veículos para uma marca e tipo de veículo específicos.
#### getFipeTable(): `Promise<FipeTable[]>`
- Retorna a lista de todas as tabelas FIPE disponíveis com ano e mês.
#### getFipeVehicleDataByCode(code: string, referenceTable?: string): `Promise<FipeVehicleData>`
- Retorna os dados do veículo com base no código FIPE e na tabela de referência fornecidos.
- Se a tabela de referência não for fornecida, a tabela mais recente será usada por padrão.

##### Fipe Models:
```ts
FipeBrand {
  name: string;
  id: string;
}

FipeTable {
  id: number;
  month: string;
}

FipeVehicleData {
  value: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  fipeCode: string;
  referenceMonth: string;
  vehicleType: number;
  fuelAcronym: string;
  consultationDate: string;
}

VehicleModel {
  model: string;
}

VehicleType {
  CAR = 'carros',
  MOTORCYCLE = 'motos',
  TRUCK = 'caminhoes',
}

```

### Feriados
#### getHolidaysByYear(year: number): `Promise<Holiday[]>`
- Retorna uma lista de feriados nacionais para o ano especificado.
- O ano deve estar entre 1900 e 2199.
##### Holiday Models:
```ts
Holiday {
  date: Date;
  name: string;
  type: string;
}
```

### IBGE
#### getStateCityByAcronym(uf: Uf): `Promise<IbgeCity[]>`
- Retorna uma lista de cidades de um estado específico, identificado pela sigla (UF).
#### getStateData(): `Promise<State[]>`
- Retorna uma lista de todos os estados do Brasil com suas informações detalhadas.
#### getStateDataByAcronym(uf: Uf): `Promise<State>`
- Retorna informações detalhadas sobre um estado específico, identificado pela sigla (UF).
##### IBGE Models:
```ts
IbgeCity {
  name: string;
  ibgeCode: string;
}

State {
  id: number;
  acronym: Uf;
  name: string;
  region: stateRegion;
}

stateRegion {
  id: number;
  acronym: string;
  name: string;
}
```
### ISBN
#### getBookByIsbn(isbn: string, provider?: IsbnProviders[]): `Promise<Book>`
- Retorna informações detalhadas sobre um livro específico, identificado pelo seu ISBN.
- Pode receber um array de provedores para buscar as informações. Se nenhum provedor for especificado, todos os provedores disponíveis serão utilizados e o primeiro resultado encontrado será retornado.

##### Book Models:
```ts
bookInfo {
  isbn: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string;
  sinopsis: string;
  dimensions: bookDimensions | null;
  year: number;
  format: string;
  pageCount: number;
  subjects: string[];
  location: string;
  retail_price: number | null;
  cover_url: string | null;
  provider: IsbnProviders;
}

IsbnProviders {
  GOOGLE_BOOKS = 'google-books',
  OPEN_LIBRARY = 'open-library',
  MERCADO_EDITORIAL = 'mercado-editorial',
  CBL = 'cbl',
}
```

### Clima Marítimo
#### getMarineWeather(code: number): `Promise<MarineWeather>`
- Retorna a previsão oceânica para a cidade costeira identificada pelo seu código IBGE.
- Utilize a função [listCities()](#cidades) para obter o código IBGE das cidades costeiras.
#### getMarineWeatherDays(code: number, days: number): `Promise<MarineWeather>`
- Retorna a previsão oceânica para a cidade costeira identificada pelo seu código IBGE para o número de dias especificado (máximo de 6 dias).
##### Marine Weather Models:
```ts
MarineWeather {
  city: string;
  uf: Uf;
  updatedAt: Date;
  waves: Wave[];
}

Wave {
  date: Date;
  data: WaveData[];
}

WaveData {
  wind: string;
  windDirection: Direction;
  windDirectionDesc: string;
  waveHeight: string;
  waveDirection: Direction;
  waveDirectionDesc: string;
  agitation: string;
  time: string;
}

Direction {
  N = 'N',
  NE = 'NE',
  E = 'E',
  SE = 'SE',
  S = 'S',
  SW = 'SW',
  W = 'W',
  NW = 'NW',
  ENE = 'ENE',
  ESE = 'ESE',
  SSE = 'SSE',
  SSW = 'SSW',
  WSW = 'WSW',
  WNW = 'WNW',
  NNW = 'NNW',
  NNE = 'NNE',
}
```

### NCM

#### getAllNcm(): `Promise<NcmInfo[]>`
- Retorna a lista de todos os NCMs cadastrados na Brasil API.

#### getNcmByCode(code: string): `Promise<NcmInfo>`
- Retorna um NCM específico a partir do seu código.
- Aceita o código com ou sem pontuação.

#### getNcmByCodeOrDescription(query: string): `Promise<NcmInfo[]>`
- Retorna uma lista de NCM que batem com o fragmento de descrição ou código fornecido.

##### Marine Weather Models:
```ts
NcmInfo {
  code: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  actType: string;
  actNumber: string;
  actYear: number;
}
```

### Pix

#### getAllPixParticipant(): `Promise<PixParticipant[]>`
- Retorna a lista de todos os participantes do pix no dia atual ou anterior.

##### Pix models:
```ts
PixParticipant {
  ispb: string;
  name: string;
  reducedName: string;
  participationModality: ParticipationModality;
  participationType: ParticipationType;
  operationStartDate: Date;
}

ParticipationType {
  IDRT = 'IDRT',
  DRCT = 'DRCT',
}

ParticipationModality {
  PDCT = 'PDCT',
  GOVE = 'GOVE',
  LESP = 'LESP',
}
```

### Taxas de juros
#### getAllRate(): `Promise<Rate[]>`
- Retorna a lista com todos as taxas de juros registradas na Brasil API

#### getRateByName(ame: string): `Promise<Rate>`
- Retorna a taxa de juros pelo nome.

##### Taxas de juros models:
```ts
Rate {
  name: string;
  value: number;
}
```

### Clima Atual
#### getAirportWeaterByCode(icaoCode: string): `Promise<Weather>`
- Retorna o clima no aeroporto a partir do seu código ICAO Ex: SBGR - para Guarulhos.
- A API está retornando `undefined` para todos os aeroportos neste momento.

#### getCapitalWeather(): `Promise<Weather[]>`
- Retorna a lista de todos os climas atuais nas capitais brasileiras.
- A API está retornando um erro `Erro ao buscar informações sobre capitais`.]

##### Clima Atual Models:
``` ts
Weather {
  ICAOCode: string;
  updatedAt: Date;
  atmosphericPressure: string | null;
  visibility: string | null;
  wind: string | null;
  windDirection: string | null;
  humidity: string | null;
  condition: string | null;
  conditionDescription: string | null;
  temperature: string | null;
}
```

### Previsão do tempo
#### getCityWeatherForecast(cityCode: number): `Promise<WeatherForecast>`
- Retorna a previsão do clima para o dia seguinte na cidade a partir do seu código.
- Utilize a função [listCities()](#cidades) para obter o código IBGE das cidades.

#### getCityWeatherForecastDays(cityCode: number, days: number) `Promise<WeatherForecast>`
- Retorna a previsão do clima para até 6 dias na cidade a partir do seu código.
- Utilize a função [listCities()](#cidades) para obter o código IBGE das cidades.
- Mínimo de 1 dia máximo de 6 dias.

##### Previsão do tempo models:
``` ts
WeatherForecast {
  city: string;
  uf: Uf;
  updatedAt: Date;
  forecast: Forecast[];
}

Forecast {
  date: Date;
  condition: string;
  minTemperature: number;
  maxTemperature: number;
  UVIndex: number;
  conditionDescription: string;
}
```
