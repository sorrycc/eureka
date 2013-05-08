KISSY.add "widget/draglist", (S,DOM,Node,Event,DragSwitch)->

  $ = S.all

  defaultConfig =
    enableScrollView  : true
    enableDragSwitch  : true
    enableTapHold     : true
    dragSwitchConfig:
      maxDistance   : -100
      validDistance : -30
      leftClass     : "entry-list-item-left"
      rightClass    : "entry-list-item-right"
    tapHoldConfig :
      shownClass    : 'entry-list-edit-show'

  class DragList

    constructor: (@wrapperEl, @config)->
      @wrapperEl = $ @wrapperEl
      @config = S.merge defaultConfig, @config, true
      @dragSwitchConfig = @config.dragSwitchConfig
      @tapHoldConfig = @config.tapHoldConfig
      @init()

    init: ->
      @initScrollView() if @config.enableScrollView
      @initDragSwitch() if @config.enableDragSwitch
      @initTapHold()    if @config.enableTapHold

    initScrollView: ->
      @scrollView = new DragSwitch(".entry-list-box",
        senDistance: 1
        inertiaMove: false
        binds: [
          {
            moveEls       : [] # 如果不为空，则只移动这里的元素
            maxDistance   : DOM.viewportHeight() / 2
            validDistance : 1
            passCallback  : ->
            failCallback  : null
            checkvalid    : null # 满足此条件时才可生效
          }
        ,null,
          {
            moveEls       : [] # 如果不为空，则只移动这里的元素
            maxDistance   : -DOM.viewportHeight() / 2
            validDistance : -1
            passCallback  : ->
            failCallback  : null
            checkvalid    : null # 满足此条件时才可生效
          }
        , null
        ]
      )

      @scrollView.on "dragDownEnd", (ev)=>
        box = @realEl
        matrix = @scrollView.getMatrix box
        matrix = @scrollView.parseMartix matrix
        if matrix[5] > 0
          box[0].style.webkitTransform = ""

      @scrollView.on "dragUpEnd", (ev)=>
        box = @realEl
        matrix = @scrollView.getMatrix box
        matrix = @scrollView.parseMartix matrix
        height = -box.height() + DOM.viewportHeight()
        if matrix[5] < height
          @scrollView.setMatrix box, @scrollView.translate("matrix(1,0,0,1,0,0)", height, 0)

    initDragSwitch: ->
      @dragSwitch = new DragSwitch(".ks-draglist-item-slide",
        senDistance: 3
        binds: [
          null,
          {
          moveEls        : [] # 如果不为空，则只移动这里的元素
          maxDistance   : -30
          validDistance : -30
          passCallback  : (ev)=>
#            $(ev.self.originalEl).addClass @dragSwitchConfig.rightClass
            $(ev.self.originalEl)[0].style.webkitTransform = ""
          failCallback  : null
          checkvalid    : (ev)-> # 满足此条件时才可生效
#            return $(ev.self.originalEl).css("-webkit-transform") is "none"
            return true
          }
          null,
          {
          moveEls        : [] # 如果不为空，则只移动这里的元素
          maxDistance   : 30
          validDistance : 30
          passCallback  : (ev)=>
#            $(ev.self.originalEl).addClass @dragSwitchConfig.leftClass
            $(ev.self.originalEl)[0].style.webkitTransform = ""
          failCallback  : null
          checkvalid    : (ev)-> # 满足此条件时才可生效
#            return $(ev.self.originalEl).css("-webkit-transform") is "none"
            return true
          }
        ]
      )

      @wrapperEl.on "touchstart", -> $('.ks-draglist-item-slide').removeClass "entry-list-item-right entry-list-item-left"
      @dragSwitch.on "dragLeft dragRight", (e)=>
#        @scrollView?.enabled = false
        if (e.self.key is 1 && e.self.distance > 0)
          e.self.isSendStart = false
          e.self.eventType = "dragRight"
          e.self.key = 3
          e.self.effectBind = e.self.config.binds[e.self.key]
#          e.self.backward = e.self.effectBind.validDistance > 0
#          console.log "turn left", e
        else if (e.self.key is 3 && e.self.distance < 0)
          e.self.isSendStart = false
          e.self.eventType = "dragLeft"
          e.self.key = 1
          e.self.effectBind = e.self.config.binds[e.self.key]
#          e.self.backward = e.self.effectBind.validDistance > 0
#          console.log "turn right"

    initTapHold: ->
      @isTapHolding = false

      # 定义 tapHold2 事件
      tapHoldHandler = (ev)->
        $(ev.target).fire 'tapHold2', ev
      timer = null
      moveCount = 0
      @wrapperEl.on "touchstart", (ev)=>
        moveCount = 0
        clearTimeout timer
        timer = setTimeout =>
          tapHoldHandler.call @, ev
        , 1000
      @wrapperEl.on "touchend", -> clearTimeout timer


      @wrapperEl.on "touchmove", ->
        moveCount++
        console.log moveCount
        if moveCount > 10 then clearTimeout timer

      @wrapperEl.delegate "tapHold2", ".ks-draglist-item", (ev)=>
        el = $(ev.currentTarget)
#        panelEl = el.one '.ks-draglist-item-edit'
        el.addClass @tapHoldConfig.shownClass
        @isTapHolding = true

      @wrapperEl.on "touchstart", =>
        if @isTapHolding
          $(".ks-draglist-item").removeClass @tapHoldConfig.shownClass

,
  requires: ["dom", "node", "event", "widget/dragswitch"]