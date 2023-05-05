package com.techvg.store.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A PurchaseProduct.
 */
@Entity
@Table(name = "purchase_product")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PurchaseProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private Double price;

    @Column(name = "units")
    private Integer units;

    @Column(name = "jhi_from")
    private String from;

    @Column(name = "company")
    private String company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PurchaseProduct id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public PurchaseProduct name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return this.category;
    }

    public PurchaseProduct category(String category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return this.price;
    }

    public PurchaseProduct price(Double price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getUnits() {
        return this.units;
    }

    public PurchaseProduct units(Integer units) {
        this.setUnits(units);
        return this;
    }

    public void setUnits(Integer units) {
        this.units = units;
    }

    public String getFrom() {
        return this.from;
    }

    public PurchaseProduct from(String from) {
        this.setFrom(from);
        return this;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getCompany() {
        return this.company;
    }

    public PurchaseProduct company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PurchaseProduct)) {
            return false;
        }
        return id != null && id.equals(((PurchaseProduct) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PurchaseProduct{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", category='" + getCategory() + "'" +
            ", price=" + getPrice() +
            ", units=" + getUnits() +
            ", from='" + getFrom() + "'" +
            ", company='" + getCompany() + "'" +
            "}";
    }
}
