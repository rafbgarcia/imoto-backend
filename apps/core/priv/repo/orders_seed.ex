##### Pedido 1
angelo = Db.Repo.insert!(%Core.Customer{name: "Angelo da Silva", phone_number: "(84) 98141-4140"})

order = Db.Repo.insert!(%Core.Order{price: 3430, customer_id: angelo.id, motoboy_id: 1})

stop1 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Pegar documento com Angelo",
    sequence: 0,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Rua Lafayette Lamartine",
  number: "1785",
  neighborhood: "Candelária",
  zipcode: "59064-510",
  complement: "Apt 1502 bloco B",
  reference: "Próximo a Cabo Telecom",
  city: "Natal",
  uf: "RN",
  stop_id: stop1.id
})

stop2 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Entregar documento a Sidney no cartório",
    sequence: 1,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Av. Roberto Freire",
  number: "2920",
  neighborhood: "Campim Macio",
  zipcode: "59082-400",
  complement: nil,
  reference: nil,
  city: "Natal",
  uf: "RN",
  stop_id: stop2.id
})

##### Pedido 2
carlos = Db.Repo.insert!(%Core.Customer{name: "Carlos Almeida", phone_number: "(84) 98812-3029"})

order = Db.Repo.insert!(%Core.Order{price: 853, customer_id: carlos.id, motoboy_id: 1})

stop1 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Pegar certidão de casamento",
    sequence: 0,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Av. Roberto Freire",
  number: "2920",
  neighborhood: "Campim Macio",
  zipcode: "59082-400",
  complement: nil,
  reference: nil,
  city: "Natal",
  uf: "RN",
  stop_id: stop1.id
})

stop2 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Me entregar no meu endereço",
    sequence: 1,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Avenida Campos Sales",
  number: "703",
  neighborhood: "Tirol",
  zipcode: "59020-300",
  complement: "Apt 703",
  reference: "Ao lado da câmara municipal",
  city: "Natal",
  uf: "RN",
  stop_id: stop2.id
})

##### Pedido 3
sandro = Db.Repo.insert!(%Core.Customer{name: "Sandro Júnior", phone_number: "(84) 98002-2030"})

order = Db.Repo.insert!(%Core.Order{price: 5000, customer_id: sandro.id, motoboy_id: 1})

stop1 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Pegar certidão de casamento e tirar cópia",
    sequence: 0,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Av. Roberto Freire",
  number: "2920",
  neighborhood: "Campim Macio",
  zipcode: "59082-400",
  complement: nil,
  reference: nil,
  city: "Natal",
  uf: "RN",
  stop_id: stop1.id
})

stop2 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Entregar uma via no meu escritório",
    sequence: 1,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Avenida Campos Sales",
  number: "703",
  neighborhood: "Tirol",
  zipcode: "59020-300",
  complement: "Apt 703",
  reference: "Ao lado da câmara municipal",
  city: "Natal",
  uf: "RN",
  stop_id: stop2.id
})

stop3 =
  Db.Repo.insert!(%Core.Stop{
    instructions: "Entregar outra via no meu apartamento",
    sequence: 2,
    order_id: order.id
  })

Db.Repo.insert!(%Core.Location{
  street: "Rua Lafayette Lamartine",
  number: "1785",
  neighborhood: "Candelária",
  zipcode: "59064-510",
  complement: "Apt 1502 bloco B",
  reference: "Próximo a Cabo Telecom",
  city: "Natal",
  uf: "RN",
  stop_id: stop3.id
})
