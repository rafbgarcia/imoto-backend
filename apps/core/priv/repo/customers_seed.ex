angelo = Db.Repo.insert!(Core.Customer.changeset(%Core.Customer{}, %{name: "Angelo da Silva", phone_number: "(84) 98141-4140"}))

order = Db.Repo.insert!(%Core.Order{price: 3430, customer_id: angelo.id})
