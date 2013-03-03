﻿$(function () {
    
    var viewModel = kendo.observable({
        model: {},
        images: [],
        makes: [],
        deleteImage: deleteImage,
        save: save
    });
    
    var modelId = $.url().segment(-1);
    var makeId = $.url().param("makeId");
    if (!makeId) makeId = null;
    $.ajax({
        url: "/Api/Models/" + modelId,
        dataType: "json",
        type: "GET",
        data: { makeId: makeId },
        success: function (model) {
            viewModel.set("model", model);
            viewModel.set("images", model.Images);
            viewModel.set("makes", model.Makes);
        }
    });
    
    kendo.bind($("body"), viewModel);

    $("#year").kendoNumericTextBox({ format: "#", decimals: 0 });
    $("#breakHorsepower").kendoNumericTextBox({ format: "#", decimals: 0 });
    $("#zeroToSixty").kendoNumericTextBox({ step: 0.01 });
    $("#topSpeed").kendoNumericTextBox({ format: "#", decimals: 0 });
    $("#basePrice").kendoNumericTextBox({ format: "c" });
    
    $("#make").kendoComboBox();
    
    $("#images").kendoGrid({
        columns: [
            { field: "Order", title: "Order", width: "60px", editor: imageOrderEditor },
            { field: "ShortDescription", title: "Description", width: "100px", editor: imageDescriptionEditor },
            { field: "LowResolutionUrl", title: "Low Resolution Url", editor: imageUrlEditor },
            { field: "HighResolutionUrl", title: "High Resolution Url", editor: imageUrlEditor },
            { template: kendo.template($("#commandTemplate").html()), title: "&nbsp;", width: "88px" }
        ],
        editable: true,
        sortable: true,
        toolbar: ["create"]
    });

    $("body").kendoValidator();

    function imageOrderEditor(container, options) {
        $('<input class="imageOrder" required validationMessage = "Please enter Order" data-role="numerictextbox" min="1" max="50" data-bind="value:' + options.field + '"/>').appendTo(container);
    }

    function imageDescriptionEditor(container, options) {
        $('<input class="imageDescription" type="text" required validationMessage = "Please enter Description" maxLength="25" data-bind="value:' + options.field + '"/>').appendTo(container);
    }

    function imageUrlEditor(container, options) {
        $('<input type="text" class="imageUrl" pattern="\/(([a-zA-Z0-9\-_\/]*)?)([a-zA-Z0-9])+\.((jpg|jpeg|gif|png)(?!(\w|\W)))" required validationMessage = "Url is required and must be a valid path" maxLength=1024 data-bind="value:' + options.field + '"/>').appendTo(container);
    }
    
    function deleteImage(e) {
        if (confirm("Are you sure you want to delete this record?")) {
            var image = e.data;
            var images = viewModel.get("images");
            var index = images.indexOf(image);
            images.splice(index, 1);
        }
    }
    
    function save() {
        var validator = $("body").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            var model = viewModel.model;
            model.Images = viewModel.images;
            if (viewModel.model.MakeId.Id)
                model.MakeId = viewModel.model.MakeId.Id;
            else
                model.MakeId = viewModel.model.MakeId;
            $.ajax({
                url: "/Api/Models/",
                type: 'POST',
                data: JSON.stringify(model),
                contentType: "application/json;charset=utf-8",
                success: function () {
                    $("#status").text("Saved Successfully!").removeClass("error").addClass("success");
                }
            });
        } else {
            $("#status").text("Validation Errors!").removeClass("success").addClass("error");
        }
    }
});